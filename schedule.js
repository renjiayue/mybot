const schedule = require('node-schedule');
const orderService = require('./service/orderService')
const taokoulingCom = require('./taokoulingCom')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const  scheduleCronstyle = async()=>{
    //0分钟开始每6分钟定时执行一次:
    schedule.scheduleJob('0 0/6 * * * ? ',async()=>{
        let nodeCurdate = new Date()
        // let curdate = new Date(nodeCurdate.getTime()+(480*60-1)*1000)
        let curdate = nodeCurdate
        let sixBefore = new Date(curdate.getTime()-(20*60-1)*1000)
        // console.log(sixBefore.Format("yyyy-MM-dd hh:mm:ss"))
        // console.log('scheduleCronstyle:' + curdate.Format("yyyy-MM-dd hh:mm:ss"));
        console.log('taokoulingCom',taokoulingCom)
        console.log(sixBefore.Format("yyyy-MM-dd hh:mm:ss"))
        console.log(curdate.Format("yyyy-MM-dd hh:mm:ss"))
        let orderDetails = await taokoulingCom.getOrderDetails({start_time:sixBefore.Format("yyyy-MM-dd hh:mm:ss"),end_time:curdate.Format("yyyy-MM-dd hh:mm:ss")
            ,query_type:'2',member_type:'2',page_size:100})
        orderService.processOrderBatch(orderDetails)
        // orderService.
    }); 
    
    //轮询对象
    var pollingObj = {
      isPollAgain:true,
      pollEndTime:'',
      pollTimeList:[],
      curIndex:0,//当前轮询索引
    }
    /**
     * 轮询处理
     */
    async function pollProcess(){
      if(!pollingObj.pollTimeList[pollingObj.curIndex]){
        pollingObj.isPollAgain = true
        pollingObj.pollTimeList = []
        pollingObj.curIndex = 0
        return
      }
      console.log('当前轮询到第N条'+(pollingObj.curIndex+1))
      console.log('当前轮询时间段为'+pollingObj.pollTimeList[pollingObj.curIndex].startTime+" "+pollingObj.pollTimeList[pollingObj.curIndex].endTime)
      let orderDetails = await taokoulingCom.getOrderDetails({start_time:pollingObj.pollTimeList[pollingObj.curIndex].startTime,end_time:pollingObj.pollTimeList[pollingObj.curIndex].endTime
        ,query_type:'2',member_type:'2',page_size:100})
      // console.log(orderDetails)
      orderService.processOrderBatch(orderDetails)
      pollingObj.curIndex = pollingObj.curIndex+1
    }
    //3分钟开始每6分钟定时执行一次:
    schedule.scheduleJob('0 3/6 * * * ? ',async()=>{
      if(pollingObj.isPollAgain){
        console.log('scheduleCronstyle:' + new Date());
        //3  13 为最终状态
        let unclearedList = await orderService.baseFindByFilterOrder(null,{tk_status:{[Op.notIn]: [3, 13]}},[['tb_paid_time', 'ASC']])
        if(unclearedList){
          // console.log(unclearedList)
          for(let i in unclearedList){
            let unclearedOrder = unclearedList[i].dataValues
            let tb_paid_time = new Date(unclearedOrder.tb_paid_time)
            // if(pollingObj.pollTimeList.length>0){
            //   console.log('pollTimeListlength'+pollingObj.pollTimeList.length)
            // }
            if(pollingObj.pollTimeList.length==0 || 
                (unclearedOrder.tb_paid_time>pollingObj.pollTimeList[pollingObj.pollTimeList.length-1].endTime)){
              let endTime = new Date(tb_paid_time.getTime()+(20*60-1)*1000)
              pollingObj.pollTimeList.push({startTime:tb_paid_time.Format("yyyy-MM-dd hh:mm:ss"),endTime:endTime.Format("yyyy-MM-dd hh:mm:ss")})
            }
          }
          console.log(pollingObj)
          pollingObj.isPollAgain = false
          pollProcess()
        }
      }else{
        console.log('false')
        pollProcess()
      }
    }); 
}



// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(H)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd HH:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d H:m:s.S")      ==> 2006-7-2 8:9:4.18   
Date.prototype.Format = function(fmt)   
{ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}
// console.log(new Date('2020-06-13 19:53:00'))
scheduleCronstyle();

// module.exports = 