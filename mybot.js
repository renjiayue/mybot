/**
 * 我的第一个机器人
 */

// import { Wechaty, config } from 'wechaty'

// import { FileBox } from 'file-box'
// import { generate } from 'qrcode-terminal'
const { Wechaty,Contact,Room, config,Message,Friendship} = require('wechaty')

const { FileBox }  = require('file-box')
const { generate } = require('qrcode-terminal')

// const { PuppetPadplus } =  require('wechaty-puppet-padplus')

const botConfig = require('./botConfig')

const serverChan = require('./serverChan.js')

const taokoulingCom = require('./taokoulingCom')

const dataoke = require('./dataoke')

const tkurlTop = require('./tkurlTop')

const orderService = require("./service/orderService.js")
const userService = require("./service/userService.js")
const shareService = require("./service/shareService.js")

const botUtil= require('./botUtil.js')

const {schedule}= require('./schedule.js')

// node-request请求模块包
const request = require("request")

const default_income_radio = 0.6
// 请求参数解码
//const urlencode = require("urlencode")


/**
 * 创建我的机器人
 * @param profile 加载配置
 * @param name 机器人名称
 */
const bot = botUtil.bot
// Wechaty.Message

/**
 * 添加机器人时间处理方法
 * @param logout 注销登录后调用 onLogout 方法
 * @param login 登录成功后调用 onLogin 方法
 * @param scan 需要扫描二维码时调用 onScan 方法
 * @param error 出现错误时调用 onError 方法
 * @param message 收到消息后调用 onMessage方法
 */
bot
.on('logout', onLogout)
.on('login',  onLogin)
.on('scan',   onScan)
.on('error',  onError)
.on('message', onMessage)
.on('friendship',onFrendship)

/**
 * 启动机器人
 * @method stop 出现异常调用停止机器人方法
 */
bot.start()
.catch(async e => {
  console.error('Bot start() fail:', e)
  await bot.stop()
  process.exit(-1)
})

//机器人事件对应方法实现 begin 
//包含以下function `scan`, `login`, `logout`, `error`, and `message`
function onScan (qrcode, status) {
  /* generate(qrcode, { small: true }) */

  // Generate a QR Code online via
  // http://goqr.me/api/doc/create-qr-code/
  const qrcodeImageUrl = [
    'https://api.qrserver.com/v1/create-qr-code/?data=',
    encodeURIComponent(qrcode),
  ].join('')

  //发送server酱消息通知管理员登录小v
  // serverChan.sendServerChanMsg('点击链接登录小v',qrcodeImageUrl)

  console.log(`[${status}] ${qrcodeImageUrl}\nScan QR Code above to log in: `)
}

function onLogin (user) {
  console.log(`${user.name()} login`)
  // bot.say('Wechaty login').catch(console.error)
  // scheduleCronstyle()
  // console.log(schedule)
}

function onLogout (user) {
  console.log(`${user.name()} logouted`)
}

function onError (e) {
  console.error('Bot error:', e)
  /*
  if (bot.logonoff()) {
    bot.say('Wechaty error: ' + e.message).catch(console.error)
  }
  */
}
const fileBoxMap = {}
async function onFrendship(friendship ){
  console.log("friendship")
  console.log(friendship)

  console.log('自动添加好友处理')
  switch (friendship.type()) {
    case this.Friendship.Type.Receive:
      await friendship.accept()
      console.log(`accept friendship!`)
      break
    case this.Friendship.Type.Confirm:
      await friendship.contact().say(`Nice to meet you~`)
      await friendship.contact().say('给小v发送"饿了么","饿了么红包","外卖","外卖红包"领取饿了么红包')
      friendship.contact().say('发送手淘商品"分享→复制链接→粘贴到微信"的链接可以查询优惠信息')
	  // if(fileBoxMap.tbsharefileBox){
		// console.log('自动添加好友图片已加载')
	  // }else{
		// const tbsharefileBox1 = FileBox.fromUrl("http://www.renjiayue.com/wxrobot1/tbshare.jpg")
		// fileBoxMap.tbsharefileBox  = tbsharefileBox1
		// //msg.say(fileBoxMap.tbsharefileBox)
	  // }
	  // friendship.contact().say(fileBoxMap.tbsharefileBox)
	  
      
      break
  }
}

const fixedConvert = {'饿了么':['饿了么'],'饿了么红包':['饿了么']
                        ,'饿了吗':['饿了么'],'饿了吗红包':['饿了么']
                        ,'外卖':['饿了么'],'外卖红包':['饿了么']}
/**
 * 最重要的部分--消息处理部门
 * @param {*} msg 
 */
async function onMessage (msg) {
  console.log(msg.toString())

  //自己发送的消息不做处理
  if(msg.self()){
    // console.log('消息是自己发送的,不做处理')
    return
  }
  if(msg.room()){
	console.log(msg.text())
	console.log('群消息不做处理')
    return
  }
  const contact = msg.from()
  if(contact){
    const isOfficial = contact.type() === bot.Contact.Type.Official
    if(isOfficial){
      console.log('公众号消息,直接转发给管理员')
      //botUtil.sendStringMessageToAdmin('收到公众号消息,请查看')
      return
    }else{
      console.log('个人消息')
    }
  }else{
    console.log('contact为空')
  }
  // if (msg.age() > 60) {
  //   console.log('消息被丢弃,因为已经超时(1分钟)')
  //   return
  // }

  //功能部分暂时放到客户端
  
  if(msg.payload.fromId=='Emp-yue'){
    let msgContent = msg.text();
    if(msgContent.indexOf("同步订单") != -1){
      let msgArray = msgContent.split(' ')
      for(let i in msgArray){
        console.log(msgArray[i])
      }
      let orderDetails = await taokoulingCom.getOrderDetails({start_time:msgArray[1]+' '+msgArray[2],end_time:msgArray[3]+' '+msgArray[4],query_type:'2',member_type:'2',page_size:100})
      orderService.processOrderBatch(orderDetails)
      return
    }
  }

  if ( msg.type() === bot.Message.Type.Text) {
    // sendMessageToServer('服务器发送测试',msg)
    let msgContent = msg.text();
    // sendMessageToServer(msgContent,msg)
    let fixedContent;
    if(msgContent.length<10){
      fixedContent = fixedConvert[msgContent]
    }
    console.log('fixedContent',fixedContent)
    if(fixedContent && fixedContent[0]==='饿了么'){
      await eleRedBag(msg)
      eleNewRetailRedBag(msg);
    }else{
      let tkl = taokoulingCom.contentToTkl(msgContent);
      console.log('tkl',tkl)
      if(tkl){

        //先使用大淘客转链
        // let await dataoke.twdToTwd(tkl)

        //使用大淘客解析 不使用转变的淘口令 使用原始的
        //使用$ 不然请求会不识别字符
        console.log(tkl.replace(/￥/g,'$'))
        let dtkjx = await dataoke.commonParseContent(tkl.replace(/￥/g,'$'));
        // console.log(dtkjx)
        if(dtkjx){
          // console.log('dtkjx',dtkjx)
          console.log('goodsId',dtkjx.goodsId)
          console.log('goodsTitle',dtkjx.originInfo.title)
          if(dtkjx.goodsId){
            let trans = await dataoke.getPrivilegeLink(dtkjx.goodsId)
            console.log('大淘客高效转链成功',trans)
            let wx_id  = msg.payload.fromId
            console.log('wx_id',wx_id)
            let userInfo
            userInfo = await userService.baseFindByFilter(null,{'wx_id':wx_id})
            if(userInfo[0]){
              userInfo = userInfo[0].dataValues
              // console.log(userInfo)
              // income_radio = userInfo.income_radio
            }
            let sendResult = sendDiscountInfo(msg,userInfo,trans.tpwd,trans.originalPrice,null,trans.actualPrice,trans.couponInfo,Number(trans.maxCommissionRate)*100)
            if(sendResult){
              console.log("大淘客优惠信息发送成功")
              return
            }else{
              console.log("大淘客高效转链失败")
            }
            if(dtkjx.originInfo.title){
              tklProcess(msg,dtkjx.goodsId,dtkjx.originInfo.title)
              return
            }
          }else{
            console.log("大淘客商品解析失败")
          }
          // return
        }

        // let thirdParty = null
        // 不再使用 收费
        // thirdParty = await taokoulingCom.thirdPartyTkljx(tkl)
        // console.log('thirdParty',thirdParty)
        // if(thirdParty){
        //   let goodsId  = await tkurlTop.thirdPartyTkljxToId(tkl)
		    //   console.log('goodsId--1',goodsId)
        //   if(!goodsId){
			  //     console.log('goodsId--2',goodsId)
        //     botUtil.sendStringMessageToAdmin('三方淘口令解析为商品id出错,请查看')
        //     goodsId = jiexiGoodsIdByUrl(thirdParty.url)
        //   }
        //   console.log('三方淘口令解析为商品id成功')
        //   let goodsTitle = thirdParty.content;
        //   //安卓手淘聚划算title处理
        //   goodsTitle = goodsTitle.replace('这个#聚划算团购#宝贝不错:','')
        //   goodsTitle = goodsTitle.replace('(分享自@手机淘宝android客户端)','')
        //   console.log('处理完聚划算后title是:'+goodsTitle)
        //   tklProcess(msg,goodsId,goodsTitle)
        //   return 
        // }
        // console.log('三方解析淘口令失败,请查看')
        // botUtil.sendStringMessageToAdmin('三方解析淘口令失败,请查看')
      }
      //test 正则
      let tolurlReg = new RegExp('[a-zA-z]+://[^\\s]*')
      let tolurlRegExec = tolurlReg.exec(msgContent)
      let jiexiUrl;
      if(!tolurlRegExec){
        msg.say("无法解析的口令内容")
        botUtil.sendStringMessageToAdmin('未搜索到url内容:'+msgContent)
        return
      }
      jiexiUrl = tolurlRegExec[0]
      console.log('jiexiUrl',jiexiUrl)
      request({
        url: jiexiUrl,
        method: "GET",
    }, function(error, response, body) {
      // console.log(error)
      // console.log(response)
      // console.log(body)
        if (!error && response.statusCode == 200) {
            // let isParseSucess = false;
            let titleReg = new RegExp('"title"[\\s]*:[\\s]*"[^"]*"')
            let titleExec = titleReg.exec(body);
            // console.log('body',body)
            // console.log('titleExec',titleExec)
            let title
            if(!titleExec){
              //未搜索到title内容
              msg.say("无法解析的链接地址")
              botUtil.sendStringMessageToAdmin('无法解析的链接地址,未解析出商品title:'+msgContent)
              return 
            }
            console.log(titleExec,'titleExec')
            title = titleExec[0]
            title = title.replace(new RegExp('"title"[\\s]*:[\\s]*"'),'')
            title = title.substring(0,title.length-1)
            console.log('title是:'+title)

            //处理优惠券链接
            let index = title.indexOf('优惠券送给你')
            if(index!=-1){
              let subContent = title.substring(index)
              let startIndex = subContent.indexOf('【')
              let endIndex = subContent.indexOf('】')
              if(startIndex!=-1 && endIndex!=-1){
                title = subContent.substring(startIndex+1,endIndex)
              }
            }
            console.log('处理完优惠券链接后title是:'+title)

            //安卓手淘聚划算title处理
            title = title.replace('这个#聚划算团购#宝贝不错:','')
            title = title.replace('(分享自@手机淘宝android客户端)','')
            console.log('处理完聚划算后title是:'+title)
            
            let goodsId = jiexiGoodsIdByUrl(body)
            if(goodsId){
              tklProcess(msg,goodsId,title)
            }else{
              msg.say("无法解析的链接地址")
              botUtil.sendStringMessageToAdmin('无法解析的链接地址,未解析出商品id:'+msgContent)
            }
        }else{
            msg.say("无法解析的链接地址")
            console.log("请求失败")
        }
    });
    }
  }else if(msg.type()===bot.Message.Type.Contact){
    sendMessageToAdmin(msg)//名片需要发给管理员确认推荐关联关系
  }else if(msg.type()===bot.Message.Type.Transfer){
    // msg.say('感谢您的打赏,小v会更加努力')
    botUtil.sendStringMessageToAdmin('收到来自'+msg.from().name()+'的转账')//名片需要发给管理员确认推荐关联关系
  }else if(msg.type()===bot.Message.Type.RedEnvelope){
    // msg.say('感谢您的红包,小v会更加努力')
    botUtil.sendStringMessageToAdmin('收到来自'+msg.from().name()+'的红包')//名片需要发给管理员确认推荐关联关系
  }else{
    msg.say('小v暂时还不理解你的意思')
    // sendMessageToAdmin(msg)
  }
}

//机器人事件对应方法实现 end

//自定义方法

const adminList = new Array()
var  loadAdmin =  async function(){
  const personAdmin = await bot.Contact.find({id: 'Emp-yue'})
  adminList.push(personAdmin)
  // const onlyAdmin2 = await bot.Contact.find({alias: '任佳月2'})
  const roomAdmin = await bot.Room.find({topic: 'rjyma'})
  adminList.push(roomAdmin)
}



/**
 * 将消息转发给所有管理员
 * @param {*} msg 
 */
async function forwordToAdminList(msg){
  if(msg instanceof bot.Message){
    // botUtil.sendStringMessageToAdmin("消息来自:"+msg.from())
    for(let cont in adminList){
      if(adminList[cont]!=null){
        msg.forward(adminList[cont])
      }
    }
  }
}
/**
 * 
 * @param {Message} msg 
 */
function sendMessageToAdmin(msg){
  if(msg instanceof bot.Message){
    if(msg.type()===bot.Message.Type.Text){
      botUtil.sendStringMessageToAdmin("消息来自:"+msg.from()+' '+msg.payload.fromId)
      botUtil.sendStringMessageToAdmin('消息内容:'+msg.text())
    }else if(msg.type()===bot.Message.Type.Contact){
      //名片处理
      botUtil.sendStringMessageToAdmin("名片消息来自:"+msg.from()+' '+msg.payload.fromId)
      // console.log(msg)
      /**
       * 开发过程中发现名片消息转发失败,msg.toContact()也未实现,所以只发送具体内容给管理员
       */
      // console.log(msg.id)
      // console.log(msg.payload)
      // botUtil.sendStringMessageToAdmin(msg.payload.text)//获取名片的具体信息(但是看不到id)
      // botUtil.sendStringMessageToAdmin(msg.fromId)
      // botUtil.sendStringMessageToAdmin((await msg.toContact()).toString())//发给管理员确认推荐关联关系
    }else{
      botUtil.sendStringMessageToAdmin('发送错误的消息类型给管理员')
    }
  }else{
    botUtil.sendStringMessageToAdmin('发送消息被错误的调用')
  }
  
}

/**
 * 请求服务器并返回结果
 * @param {string} content 文本
 * @param {Message} msg 原消息对象
 */
async function sendMessageToServer(content,msg){
  request({
      url: "http://172.18.0.1:9396/wxRobot/onMessage",
      method: "POST",
      json: true,
      async:false,
      headers: {
          "content-type": "application/json"
      },
      body: {"message":content}
  }, function(error, response, body) {
    // console.log(error)
    // console.log(response)
    // console.log(body)
      if (!error && response.statusCode == 200) {
          console.log(body) // 请求成功的处理逻辑
          // msg.say(body.data)
           
      }else{
console.log('服务器未能正确处理消息')
        // msg.say("小v未能正确处理您的消息,请联系客服wxid_6doirbu385kq22")
      }
  });
};

// sendMessageToServer("aaaa")


//淘客相关
var apiClient = require('./lib/api/topClient.js').TopClient;
console.log('apiClient',apiClient)
var dingtalkClient = require('./lib/api/dingtalkClient.js').DingTalkClient;
var tmcClient = require('./lib/tmc/tmcClient.js').TmcClient;

// module.exports = {
//     ApiClient: apiClient,
//     TmcClient: tmcClient,
// 	DingTalkClient: dingtalkClient
// };


// ApiClient = require('ApiClient').ApiClient;
var ApiClient  = apiClient
var client = new ApiClient(botConfig.tbk.client);

async function eleRedBag(msg){
  //if(fileBoxMap.elefileBox){
    //await msg.say('获取饿了么小程序码\r\n识别领取红包')
    //await msg.say(fileBoxMap.elefileBox)
    //console.log('文件存在不用重新下载');
    //return;
  //}
	  
  
  client.execute('taobao.tbk.activity.info.get', {
    'adzone_id':botConfig.tbk.adzone_id,
    'activity_material_id':'1571715733668'
  }, function(error, response) {
    if (!error) {
      console.log(response);
      if(response.data.wx_qrcode_url){
        msg.say('获取饿了么小程序码\r\n识别领取红包')
        const fileBox = FileBox.fromUrl(response.data.wx_qrcode_url)
        fileBoxMap.elefileBox = fileBox
        msg.say(fileBox)
      }else{
        msg.say('点击下方链接领取饿了么红包')
        msg.say(response.data.short_click_url)
      }
    }else {
      console.log(error);
      msg.say("红包获取失败")
      botUtil.sendStringMessageToAdmin("饿了么红包调用接口请求失败")
    }
  })
  // client.execute('taobao.tbk.activitylink.get', {
  //   'adzone_id':botConfig.tbk.adzone_id,
  //   'promotion_scene_id':'1571715733668'
  // }, function(error, response) {
  //   if (!error) {
  //     console.log(response);
  //     msg.say('获取饿了么小程序码\r\n识别领取红包')
  //     const fileBox = FileBox.fromUrl(response.data.wx_qrcode_url)
	//     fileBoxMap.elefileBox = fileBox
  //     msg.say(fileBox)
  //   }else {
  //     console.log(error);
  //     msg.say("红包获取失败")
  //     botUtil.sendStringMessageToAdmin("饿了么红包调用接口请求失败")
  //   }
  // })
}

async function eleNewRetailRedBag(msg){
  //if(fileBoxMap.eleNewRetailfileBox){
    //await msg.say('获取饿了么果蔬商超小程序码\r\n识别领取红包')
    //await msg.say(fileBoxMap.eleNewRetailfileBox)
    //console.log('文件存在不用重新下载');
    //return;
  //}
	  
  
  client.execute('taobao.tbk.activity.info.get', {
    'adzone_id':botConfig.tbk.adzone_id,
    'activity_material_id':'1585018034441'
  }, function(error, response) {
    if (!error) {
      console.log(response);
      if(response.data.wx_qrcode_url){
        msg.say('获取饿了么果蔬商超小程序码\r\n识别领取红包')
        const fileBox = FileBox.fromUrl(response.data.wx_qrcode_url)
        fileBoxMap.eleNewRetailfileBox = fileBox
        msg.say(fileBox)
      }else{
        msg.say('点击下方链接领取饿了么果蔬商超红包')
        msg.say(response.data.short_click_url)
      }
    }else {
      console.log(error);
      msg.say("红包获取失败")
      botUtil.sendStringMessageToAdmin("饿了么红包调用接口请求失败")
    }
  })
}

/**
 * 淘口令处理
 * @param {*} msg 原message
 * @param {*} id 商品id
 * @param {*} title 商品title
 */
async function tklProcess(msg,id,title){
  // title = '彩色粗划重点背书神器闪光莹光银光萤光笔'
  console.log('需要查询商品的id是'+id+'title是'+title)
  let income_radio = default_income_radio
  let wx_id  = msg.payload.fromId
  console.log('wx_id',wx_id)
  let userInfo
  try {
    // console.log('wx_id',msg.payload.fromId)
    userInfo = await userService.baseFindByFilter(null,{'wx_id':wx_id})
    if(userInfo[0]){
      userInfo = userInfo[0].dataValues
      // console.log(userInfo)
      income_radio = userInfo.income_radio
    }else{
      await userService.baseCreate({
        wx_id:wx_id,
        income_radio:default_income_radio,
        total_commission:0,
        comment:msg.from().name()
      })
      userInfo = await userService.baseFindByFilter(null,{'wx_id':wx_id})
      userInfo = userInfo[0].dataValues
      // console.log(userInfo)
      income_radio = userInfo.income_radio
    }
  } catch (error) {
    console.log('订单分享查询用户信息失败')
    console.log(error)
  }
  console.log('income_radio',income_radio)
  
    let page_size = 100
    let page_no = 0
    let queryTotleCount = page_size
    let isExist = false;//优惠信息是否存在
    while(Math.ceil(queryTotleCount/page_size)>page_no && page_no<30){
        ++page_no;
        await new Promise(function(resolve,reject){
            console.log('第几次进入查询',page_no)
            client.execute('taobao.tbk.dg.material.optional', {
                'adzone_id':botConfig.tbk.adzone_id,
                'q':title,
                'page_size':page_size,
                'page_no':page_no,
            }, function(error, response) {
                if (!error) {
                    console.log('查询第几页数据',page_no)
                    queryTotleCount = response.total_results
                    console.log('共查询到数据',queryTotleCount,'条,本页数据',response.result_list.map_data.length,'条')
                    // console.log(response.result_list.map_data);
                    console.log(response)
                    var dd = response.result_list.map_data
        
                    for(a in response.result_list.map_data){
                        // console.log(dd[a].item_id);
                        if(dd[a].item_id ==id){
                            console.log("查询到优惠信息",dd[a])
                            // console.log(dd[a])
                            if(dd[a].coupon_share_url){
                              console.log('https:'+dd[a].coupon_share_url)
                              client.execute('taobao.tbk.tpwd.create', {
                                'text':'优惠购',
                                'url':'https:'+dd[a].coupon_share_url
                              }, function(error, response) {
                                if (!error){
                                  console.log(response);
                                  let zk_final_price = Number(dd[a].zk_final_price)
                                  let coupon_start_fee = Number(dd[a].coupon_start_fee)
                                  let coupon_amount = Number(dd[a].coupon_amount)
                                  if(zk_final_price>coupon_start_fee){
                                    // let flAmt = Math.floor((1-0.1)*income_radio*Number(dd[a].commission_rate)/100*(zk_final_price-coupon_amount))/100//10%的服务费
                                    sendDiscountInfo(msg,userInfo,response.data.password_simple,dd[a].reserve_price,zk_final_price,zk_final_price-coupon_amount,dd[a].coupon_info,dd[a].commission_rate)
                                    // msg.say(userInfo.id+"优惠淘口令为:http:// "+response.data.password_simple+" 全部复制打开手淘领券购买\n优惠券"+dd[a].coupon_info+"\n原价"+dd[a].reserve_price+"元\n现价"+dd[a].zk_final_price+"元\n预计获取返利"+flAmt+"元")
                                  }else{
                                    // let flAmt = Math.floor((1-0.1)*income_radio*Number(dd[a].commission_rate)/100*zk_final_price)/100//10%的服务费
                                    sendDiscountInfo(msg,userInfo,response.data.password_simple,dd[a].reserve_price,zk_final_price,zk_final_price,dd[a].coupon_info,dd[a].commission_rate)
                                    // msg.say(userInfo.id+"优惠淘口令为:http:// "+response.data.password_simple+" 全部复制打开手淘领券购买\n"+dd[a].coupon_info+"\n原价"+dd[a].reserve_price+"元\n现价"+dd[a].zk_final_price+"元\n预计获取返利"+flAmt+"元")
                                  }
                                  try {
                                    shareService.insertOrUpdateShare({user_id:userInfo.id,item_id:dd[a].item_id})
                                  } catch (error) {
                                    console.log('用户分享表记录数据出错')
                                  }
                                }else{
                                  msg.say('未查询到优惠信息')
                                  console.log('优惠商品链接(带券)生成淘口令失败',error);
                                } 
                              })
                            }else if(dd[a].url){
                              console.log('https:'+dd[a].url)
                              client.execute('taobao.tbk.tpwd.create', {
                                'text':'优惠购',
                                'url':'https:'+dd[a].url
                              }, function(error, response) {
                                if (!error){
                                  let zk_final_price = dd[a].zk_final_price
                                  // let flAmt = Math.floor((1-0.1)*income_radio*Number(dd[a].commission_rate)/100*Number(dd[a].zk_final_price))/100//10%的服务费
                                  console.log(response);
                                  sendDiscountInfo(msg,userInfo,response.data.password_simple,dd[a].reserve_price,zk_final_price,zk_final_price,null,dd[a].commission_rate)
                                  // msg.say(userInfo.id+"优惠淘口令为:http:// "+response.data.password_simple+" 全部复制打开手淘进行购买\n原价"+dd[a].reserve_price+"元\n现价"+dd[a].zk_final_price+"元\n预计获取返利"+flAmt+"元")
                                  try {
                                    shareService.insertOrUpdateShare({user_id:userInfo.id,item_id:dd[a].item_id})
                                  } catch (error) {
                                    console.log('用户分享表记录数据出错')
                                  }
                                }else{
                                  msg.say('未查询到优惠信息')
                                  console.log('优惠商品链接生成淘口令失败',error);
                                } 
                              })
                            }
                            
                            isExist = true;
                            break;
                        }
                    }
                }else{
                  console.log('查询优惠接口调用失败',error)
                }
                resolve()//本次异步结果同步返回,执行下一次请求
            })
        })
        if(isExist){
          console.log('第',page_no,'次循环结束查询到优惠信息,退出循环')
          break;
        }else{
          console.log('第',page_no,'次循环结束未查询到优惠信息')
        }
    }
    if(!isExist){
      msg.say('未查询到优惠信息')

      if(page_no==30){
        botUtil.sendStringMessageToAdmin("3000条仍查询失败,需手动查询")
      }else{
        botUtil.sendStringMessageToAdmin("未查询到优惠信息,需手动查询")
      }
      shareService.insertOrUpdateShare({user_id:userInfo.id,item_id:id})
      botUtil.sendStringMessageToAdmin(msg.text()+'(文本内容)')
    }
}

/**
 * 
 * @param {*} msg 微信消息 必填
 * @param {*} userInfo 用户信息
 * @param {*} simplePassword 淘口令 必填
 * @param {*} originalPrice 原价
 * @param {*} currentPrice 现价
 * @param {*} actualPrice 券后价
 * @param {*} couponInfo 优惠券信息 文本
 * @param {*} commissionRate  佣金比例*100 必填
 * @returns 
 */
function sendDiscountInfo(msg,userInfo,simplePassword,originalPrice,currentPrice,actualPrice,couponInfo,commissionRate){
  if(!msg || !simplePassword || !commissionRate){
    return false
  }
  let income_radio = default_income_radio//默认返佣比例
  let user_id = userInfo.id
  if(userInfo){
    income_radio = userInfo.income_radio
    user_id = 1//随机数 用于ios14打开
  }
  let discountMsg = user_id+'优惠淘口令为: '+simplePassword+'/ 全部复制打开手淘'
  if(couponInfo){
    discountMsg += '领券购买\n优惠券'+couponInfo
  }else{
    discountMsg += '进行购买'
  }
  if(originalPrice){
    discountMsg += "\n原价"+originalPrice+"元"
  }
  if(currentPrice){
    discountMsg += "\n现价"+currentPrice+"元"
  }
  if(actualPrice && couponInfo){//实际价格并且有优惠券
    discountMsg += "\n券后价"+actualPrice+"元"
  }
  if(!actualPrice){
    actualPrice = currentPrice
  }
  console.log('income_radio',income_radio,'commissionRate',commissionRate,'actualPrice',actualPrice)
  let flAmt = Math.floor((1-0.1)*income_radio*Number(commissionRate)/100*Number(actualPrice))/100//10%的服务费
  discountMsg += "\n预计获取返利"+flAmt+"元"
  msg.say(discountMsg)
  return true
}

/**
 * 通过商品url解析商品id
 * @param {string} url 
 */
function jiexiGoodsIdByUrl(urlContent){
  let reg = new RegExp("http[s]?://a.m.taobao.com/i[0-9]*[.htm|.html]+")
  let regResult = reg.exec(urlContent)
  let url;
  if(regResult){
    url = regResult[0]

    url = url.replace("https://a.m.taobao.com/i",'');
    url = url.replace("http://a.m.taobao.com/i",'');

    url = url.replace(".html",'');

    url = url.replace(".htm",'');
    return url
  }


  reg = new RegExp("http[s]?://a.m.tmall.com/i[0-9]*[.htm|.html]+")
  regResult = reg.exec(urlContent)
  if(regResult){
    url = regResult[0]

    url = url.replace("https://a.m.tmall.com/i",'');
    url = url.replace("http://a.m.tmall.com/i",'');

    url = url.replace(".html",'');

    url = url.replace(".htm",'');

    return url
  }

  reg = new RegExp("http[s]?://item.taobao.com/item.htm[^\\s]*")
  regResult = reg.exec(urlContent)
  if(regResult){
    url = regResult[0]

    url = (new RegExp("&id=[0-9]*&*").exec(url))[0]

    url = url.replace('?id=','');
    url = url.replace('&id=','');
    url = url.replace('&','');
    return url
  }
}



        async function testRun(){
        
          // taokoulingCom.getOrderDetails({start_time:'2020-06-01 14:42:58',end_time:'2020-06-01 14:43:28',query_type:'1',member_type:'2',page_size:100})
          
        }
// testRun()
