const Sequelize = require('sequelize')
const BaseModel = require('./baseModel.js')
class OrderModel extends BaseModel{
	constructor(){
		super('tb_orders',{
			adzone_id: {type: Sequelize.INTEGER},
			adzone_name: {type: Sequelize.STRING},
			alimama_rate: {type: Sequelize.STRING},
			alimama_share_fee: {type: Sequelize.STRING},
			alipay_total_price: {type: Sequelize.STRING},
			click_time: {type: Sequelize.STRING},
			deposit_price: {type: Sequelize.STRING},
			flow_source: {type: Sequelize.STRING},
			income_rate: {type: Sequelize.STRING},
			item_category_name: {type: Sequelize.STRING},
			item_id: {type: Sequelize.STRING},
			item_img: {type: Sequelize.STRING},
			item_link: {type: Sequelize.STRING},
			item_num: {type: Sequelize.INTEGER},
			item_price: {type: Sequelize.STRING},
			item_title: {type: Sequelize.STRING},
			order_type: {type: Sequelize.STRING},
			pub_id: {type: Sequelize.INTEGER},
			pub_share_fee: {type: Sequelize.STRING},//结算预估收入
			pub_share_pre_fee: {type: Sequelize.STRING},//付款预估收入
			pub_share_rate: {type: Sequelize.STRING},
			refund_tag: {type: Sequelize.INTEGER},//维权标签，0 含义为非维权 1 含义为维权订单
			seller_nick: {type: Sequelize.STRING},
			seller_shop_title: {type: Sequelize.STRING},
			site_id: {type: Sequelize.INTEGER},
			site_name: {type: Sequelize.STRING},
			subsidy_fee: {type: Sequelize.STRING},
			subsidy_rate: {type: Sequelize.STRING},
			subsidy_type: {type: Sequelize.STRING},
			tb_deposit_time: {type: Sequelize.STRING},
			tb_paid_time: {type: Sequelize.STRING},
			terminal_type: {type: Sequelize.STRING},
			tk_commission_fee_for_media_platform: {type: Sequelize.STRING},
			tk_commission_pre_fee_for_media_platform: {type: Sequelize.STRING},
			tk_commission_rate_for_media_platform: {type: Sequelize.STRING},
			tk_create_time: {type: Sequelize.STRING},
			tk_deposit_time: {type: Sequelize.STRING},
			tk_order_role: {type: Sequelize.INTEGER},//二方：佣金收益的第一归属者； 三方：从其他淘宝客佣金中进行分成的推广者
			tk_paid_time: {type: Sequelize.STRING},
			//淘客订单状态，12-付款，13-关闭，14-确认收货，3-结算成功;不传，表示所有状态
			//	已付款：指订单已付款，但还未确认收货 已收货：指订单已确认收货，但商家佣金未支付 已结算：指订单已确认收货，且商家佣金已支付成功 已失效：指订单关闭/订单佣金小于0.01元，订单关闭主要有：1）买家超时未付款； 2）买家付款前，买家/卖家取消了订单；3）订单付款后发起售中退款成功；3：订单结算，12：订单付款， 13：订单失效，14：订单成功
			tk_status: {type: Sequelize.INTEGER},
			tk_total_rate: {type: Sequelize.STRING},
			total_commission_fee: {type: Sequelize.STRING},
			total_commission_rate: {type: Sequelize.STRING},
			trade_id: {type: Sequelize.STRING},//子订单号 唯一
			trade_parent_id: {type: Sequelize.STRING},//订单号
			pay_price:{type: Sequelize.STRING},//买家确认收货的付款金额（不包含运费金额）
			tk_earning_time:{type: Sequelize.STRING},//订单确认收货后且商家完成佣金支付的时间
		  })
		this.model = super.getModel()
		this.model.sync()
	}
}
module.exports = new OrderModel()