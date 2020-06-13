const BaseService =require('./baseService.js')
const {AutoWritedOrderModel} =require('../dao/model/AutoWrite.js')
const botUtil =require('../botUtil.js')
// @AutoWritedOrderModel
class OrderService extends BaseService{
	constructor(){
        AutoWritedOrderModel(OrderService)//替代装饰器
		super(OrderService.model)
    }
    
    /**
     * 批量处理查询到的订单数据
     * @param {*} orderList 淘宝联盟接口中的订单数据
     */
    async processOrderBatch(orderList){
        try {
            // console.log('botUtil',botUtil)
        } catch (error) {
            
        }
        // console.log(exportMybot())
        // console.log('mybot',mybot)
        // if(!mybot){
        //     return 
        // }
        // console.log('mybot',mybot)
        if(!orderList){
            return
        }
        for(let i in orderList){
            let order = orderList[i]
            let a = await this.instance.model.findOrCreate({where:{trade_id:order.trade_id},defaults:order})
            // console.log(a)
            // console.log(a[1])
            let isNewOrder = a[1]
            let selectOrder = a[0].dataValues
            //订单状态 或者 结算预估收入 或者 维权标志不同,则订单更新
            if(isNewOrder || order.tk_status!=selectOrder.tk_status || order.pub_share_fee!=selectOrder.pub_share_fee
                ||order.refund_tag!=selectOrder.refund_tag){
                // console.log(OrderService.model.model)
                //非新增订单则进行更新
                if(!isNewOrder){
                    OrderService.model.update(order,{id:selectOrder.id,trade_id:selectOrder.trade_id})
                }
                //不是新增或者状态变更,直接退出
                if(!(isNewOrder || order.tk_status!=selectOrder.tk_status)){
                    //通知管理员
                    try {
                        // exportMybot.mybot.sendStringMessageToAdmin('用户'+shareUser.comment+'绑定淘宝后缀成功:'+endSix)
                        botUtil.sendStringMessageToAdmin('订单出现状态未变更,但是金额或者退款信息变更:'+order.trade_id)
                    } catch (error) {
                        console.log('订单出现状态未变更,但是金额或者退款信息变更发送消息异常')
                    }
                    return
                }
                if(order.tk_order_role==2 && (order.order_type=='天猫'||order.order_type=='淘宝'||order.order_type=='聚划算')){
                    console.log(order.order_type+'二方订单,用户返利入库或更新开始')
                    let shareList = await OrderService.shareModel.findByFilterOrder(null,{item_id:order.item_id},[['updatedAt', 'DESC']])
                    // console.log('share',shareList)
                    if(!shareList){
                        return
                    }
                    console.log('查询到'+shareList.length+"个分享")
                    for(let j in shareList){
                        // console.log(shareList[j])
                        let share = shareList[j].dataValues
                        // console.log(shareList[j].dataValues)
                        let shareUser = (await OrderService.userModel.findByFilter(null,{id:share.user_id}))[0].dataValues
                        // console.log(shareUser)
                        console.log('订单后6为',order.trade_id.substring(order.trade_id.length-6,order.trade_id.length))
                        let endSix = order.trade_id.substring(order.trade_id.length-6,order.trade_id.length)
                        if(!shareUser.tb_part_id){
                            console.log('用户未绑定淘宝后缀,开始绑定...')
                            shareUser.tb_part_id = endSix;
                            await OrderService.userModel.update({tb_part_id:shareUser.tb_part_id},{id:shareUser.id})
                            //通知管理员
                            console.log('用户'+shareUser.comment+'绑定淘宝后缀成功:'+endSix)
                            try {
                                botUtil.sendStringMessageToAdmin('用户'+shareUser.comment+'绑定淘宝后缀成功:'+endSix)
                            } catch (error) {
                                console.log('绑定淘宝后缀发送消息异常')
                            }
                            mybot.sendStringMessageToAdmin('用户'+shareUser.comment+'绑定淘宝后缀成功:'+endSix)
                        }
                        if(shareUser.tb_part_id==endSix){
                            let shareOrder;
                            if(isNewOrder){
                                console.log('新增')
                                shareOrder = JSON.parse(JSON.stringify(order)); 
                                //除id和用户id外.全部取order中的信息
                                shareOrder.user_id =  shareUser.id
                                shareOrder = (await OrderService.shareOrderModel.create(shareOrder)).dataValues
                                // console.log(shareOrder)
                            }else{
                                console.log('更新')
                                let oldShareOrder = (await OrderService.shareOrderModel.findByFilter(null,{trade_id:order.trade_id}))[0].dataValues
                                shareOrder = JSON.parse(JSON.stringify(order)); 
                                //除id和用户id外.全部取order中的信息
                                shareOrder.id = oldShareOrder.id
                                shareOrder.user_id =  shareUser.id
                            }
                            //重新计算收益
                            //淘客订单状态，12-付款，13-关闭，14-确认收货，3-结算成功;不传，表示所有状态
                            if(order.tk_status==12 || order.tk_status==14){
                                // console.log(order.pub_share_pre_fee)
                                // console.log(order.subsidy_fee)
                                // console.log(shareUser.income_radio)
                                shareOrder.pub_share_pre_fee = Math.floor(((Number(order.pub_share_pre_fee)*(1-0.1))-Number(order.subsidy_fee)*0.2)*shareUser.income_radio*100)/100
                                // console.log(shareOrder.pub_share_pre_fee)
                            }else if(order.tk_status==3){
                                shareOrder.pub_share_pre_fee = Math.floor(((Number(order.pub_share_pre_fee)*(1-0.1))-Number(order.subsidy_fee)*0.2)*shareUser.income_radio*100)/100
                                shareOrder.pub_share_fee = Math.floor(((Number(order.pub_share_fee)*(1-0.1))-Number(order.subsidy_fee)*0.2)*shareUser.income_radio*100)/100

                                //更新收益表
                                shareUser.tb_part_id = endSix;
                                await OrderService.userModel.update({total_commission:shareUser.total_commission+shareOrder.pub_share_fee},{id:shareUser.id})
                                console.log('收益更新成功')
                            }
                            await OrderService.shareOrderModel.update(shareOrder,{id:shareOrder.id})
                            console.log('收益更新成功11111111')
                            //通知用户收益
                            try {
                                // botUtil.sendStringMessageToAdmin('收益更新成功')
                                // botUtil.sendStringMessageToOne('收益更新成功',shareUser.wx_id)
                                this.sendMsgToUser(shareOrder,shareUser)
                            } catch (error) {
                                console.log('导入发送消息异常')
                            }
                            console.log('本笔订单数据处理完成')
                            break
                        }
                    }
                }
            }
            // console.log(a[0].dataValues)
        }
    }

    /**
     * 发送消息给用户
     * @param {shareOrder} shareOrder 
     */
    async sendMsgToUser(shareOrder,shareUser){
        //付款
        console.log('sendMsgToUser')
        console.log(shareUser.wx_id)
        let msg
        if(shareOrder.tk_status==12){
            msg = '订单'+shareOrder.trade_id+'付款成功\r\n预计收益:'+shareOrder.pub_share_pre_fee+'元'
            console.log(msg)
            botUtil.sendStringMessageToOne(msg,shareUser.wx_id)
        }else if(shareOrder.tk_status==13){
            msg = '订单'+shareOrder.trade_id+'已关闭'
            console.log(msg)
            botUtil.sendStringMessageToOne(msg,shareUser.wx_id)
        }else if(shareOrder.tk_status==14){
            console.log(msg)
            msg = '订单'+shareOrder.trade_id+'确认收货\r\n预计收益:'+shareOrder.pub_share_pre_fee+'元'
            botUtil.sendStringMessageToOne(msg,shareUser.wx_id)
        }else if(shareOrder.tk_status==3){
            console.log(msg)
            msg = '订单'+shareOrder.trade_id+'已结算\r\n预计收益:'+shareOrder.pub_share_pre_fee+'元'
            botUtil.sendStringMessageToOne(msg,shareUser.wx_id)
        }else{
            console.log('订单状态不正确,无法通知用户')
        }
    }
    
}
module.exports = new OrderService()