const botConfig = require('./botConfig')

// node-request请求模块包
const request = require("request")
// 请求参数解码
//const urlencode = require("urlencode")

module.exports={
    thirdPartyTkljx: function(tklContent){
        return new  Promise(function(resolve,reject){
            request({
                url: botConfig.taokoulingCom.tkljmUrl,
                method: "POST",
                json: true,
                async:false,
                headers: {
                    "content-type": "application/x-www-form-urlencoded"
                },
                body: "apikey="+botConfig.taokoulingCom.apikey+"&tkl="+tklContent
            }, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log('')
                    console.log(body) // 请求成功的处理逻辑
                    if(body.code==1){
                        resolve(body)
                    }
                }else{
                    console.log('server酱消息发送失败')
                }
            });

        })
    },
    getOrderDetails: function(params){
        return new  Promise(function(resolve,reject){
            params.uid = botConfig.taokoulingCom.taobao_user_id
            request({
                url: botConfig.taokoulingCom.order_details_get,
                method: "POST",
                json: true,
                async:false,
                headers: {
                    "content-type": "application/json"
                },
                body: params
            }, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    if(body.data){
                        console.log(body.data)
                        console.log(body.data.results)
                        if(body.data.results.length<=0){
                            resolve(null)
                            return
                        }
                        let orderList = body.data.results.publisher_order_dto
                        console.log(orderList) // 请求成功的处理逻辑
                        // for(let i in orderList){
                        //     console.log(orderList[i])
                        // }

                        console.log('查询到订单数量:'+orderList.length)
                        resolve(orderList)
                    }
                }else{
                    console.log('server酱消息发送失败')
                    resolve(null)
                }
            });
    
        })
    },
    contentToTkl:function(content){
        console.log('content1',content)
        //₤符号淘口令
        let regExp = new RegExp('₤[\\w]*₤')
        let execResult = regExp.exec(content)
        // console.log('execResult1',execResult)
        if(execResult&&execResult[0]){
            return execResult[0]
        }
        //$符号淘口令
        regExp = new RegExp('\\$[\\w]*\\$')
        execResult = regExp.exec(content)
        console.log('execResult2',execResult)
        if(execResult&&execResult[0]){
            return execResult[0]
        }
        //￥符号淘口令
        regExp = new RegExp('￥[\\w]*￥')
        execResult = regExp.exec(content)
        // console.log('execResult3',execResult)
        if(execResult&&execResult[0]){
            return execResult[0]
        }
        // console.log('content',content)
        //₴符号淘口令
        regExp = new RegExp('₴[\\w]*₴')
        execResult = regExp.exec(content)
        // console.log('execResult4',execResult)
        if(execResult&&execResult[0]){
            return execResult[0]
        }

        //€符号淘口令
        regExp = new RegExp('€[\\w]*€')
        execResult = regExp.exec(content)
        if(execResult&&execResult[0]){
            return execResult[0]
        }
        //₳符号淘口令
        regExp = new RegExp('₳[\\w]*₳')
        execResult = regExp.exec(content)
        if(execResult&&execResult[0]){
            return execResult[0]
        }
        //¢符号淘口令
        regExp = new RegExp('¢[\\w]*¢')
        execResult = regExp.exec(content)
        if(execResult&&execResult[0]){
            return execResult[0]
        }
        //₲符号淘口令
        regExp = new RegExp('₲[\\w]*₲')
        execResult = regExp.exec(content)
        if(execResult&&execResult[0]){
            return execResult[0]
        }
        //£符号淘口令
        regExp = new RegExp('£[\\w]*£')
        execResult = regExp.exec(content)
        if(execResult&&execResult[0]){
            return execResult[0]
        }
        //₵符号淘口令
        regExp = new RegExp('₵[\\w]*₵')
        execResult = regExp.exec(content)
        if(execResult&&execResult[0]){
            return execResult[0]
        }

		// 其他解析
		regExp = new RegExp("[a-zA-Z0-9]{12}");
		execResult = regExp.exec(content)
        if(!(execResult&&execResult[0])){
            regExp = new RegExp('[a-zA-Z0-9]{11}')
			execResult = regExp.exec(content)
			if(execResult&&execResult[0]){
				return '￥'+execResult[0]+'￥'
			}
        }
        return null
    }
}

 function getOrderDetailsa(params){
    return new  Promise(function(resolve,reject){
        params.uid = botConfig.taokoulingCom.taobao_user_id
        request({
            url: botConfig.taokoulingCom.order_details_get,
            method: "POST",
            json: true,
            async:false,
            headers: {
                "content-type": "application/json"
            },
            body: params
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                // console.log('11')
                if(body.data){
                    let orderList = body.data.results.publisher_order_dto
                    // console.log(orderList) // 请求成功的处理逻辑
                    for(let i in orderList){
                        console.log(orderList[i])
                    }
                    resolve(body.data)
                }
            }else{
                console.log('server酱消息发送失败')
            }
        });

    })
}
// console.log('result', getOrderDetailsa({start_time:'2020-06-01 14:42:58',end_time:'2020-06-01 14:43:28',query_type:'1',member_type:'2',page_size:100}))

var res = [
    {
      adzone_id: 110373700027,
      adzone_name: '网站测试',
      alimama_rate: '10.00',
      alimama_share_fee: '0.83',
      alipay_total_price: '269.00',
      click_time: '2020-06-01 14:42:13',
      deposit_price: '0.00',
      flow_source: '--',
      income_rate: '3.10',
      item_category_name: '运动/瑜伽/健身/球迷用品',
      item_id: 601442927963,
      item_img: '//img.alicdn.com/tfscom/i1/222685818/O1CN01CMkGNX1sqgroe8J2E_!!222685818.jpg',
      item_link: 'http://item.taobao.com/item.htm?id=601442927963',
      item_num: 1,
      item_price: '755.00',
      item_title: '【狂欢价】美洲狮成人轮滑鞋大学生社团初学溜冰鞋成年男女可调直排轮旱冰鞋',
      order_type: '天猫',
      pub_id: 675740190,
      pub_share_fee: '0.00',
      pub_share_pre_fee: '8.34',
      pub_share_rate: '100.00',
      refund_tag: 0,
      seller_nick: '美洲狮旗舰店',
      seller_shop_title: '美洲狮旗舰店',
      site_id: 1590850452,
      site_name: '个人创作小站',
      subsidy_fee: '0.00',
      subsidy_rate: '0.00',
      subsidy_type: '--',
      tb_deposit_time: '--',
      tb_paid_time: '2020-06-01 14:42:58',
      terminal_type: '无线',
      tk_commission_fee_for_media_platform: '0.00',
      tk_commission_pre_fee_for_media_platform: '0.00',
      tk_commission_rate_for_media_platform: '0.00',
      tk_create_time: '2020-06-01 14:43:21',
      tk_deposit_time: '--',
      tk_order_role: 2,
      tk_paid_time: '2020-06-01 14:43:28',
      tk_status: 12,
      tk_total_rate: '3.10',
      total_commission_fee: '0.00',
      total_commission_rate: '3.10',
      trade_id: '1035657313150181441',
      trade_parent_id: '1035657313150181441'
    },
    {
      adzone_id: 110160350186,
      adzone_name: '爱分享',
      alimama_rate: '10.00',
      alimama_share_fee: '0.00',
      alipay_total_price: '269.00',
      click_time: '2020-06-01 14:34:47',
      deposit_price: '0.00',
      flow_source: '--',
      income_rate: '3.10',
      item_category_name: '运动/瑜伽/健身/球迷用品',
      item_id: 601442927963,
      item_img: '//img.alicdn.com/tfscom/i1/222685818/O1CN014Nr11T1sqgrxfxUR9_!!222685818.jpg',
      item_link: 'http://item.taobao.com/item.htm?id=601442927963',
      item_num: 1,
      item_price: '755.00',
      item_title: '【狂欢价】美洲狮成人轮滑鞋大学生社团初学溜冰鞋成年男女可调直排轮旱冰鞋',
      order_type: '天猫',
      pub_id: 675740190,
      pub_share_fee: '0.00',
      pub_share_pre_fee: '8.34',
      pub_share_rate: '100.00',
      refund_tag: 0,
      seller_nick: '美洲狮旗舰店',
      seller_shop_title: '美洲狮旗舰店',
      site_id: 1426800082,
      site_name: '爱分享(手机客户端专享)_675740190',
      subsidy_fee: '0.00',
      subsidy_rate: '0.00',
      subsidy_type: '--',
      tb_deposit_time: '--',
      tb_paid_time: '2020-06-01 14:36:25',
      terminal_type: '无线',
      tk_commission_fee_for_media_platform: '0.00',
      tk_commission_pre_fee_for_media_platform: '0.00',
      tk_commission_rate_for_media_platform: '0.00',
      tk_create_time: '2020-06-01 14:36:04',
      tk_deposit_time: '--',
      tk_order_role: 2,
      tk_paid_time: '2020-06-01 14:36:55',
      tk_status: 13,
      tk_total_rate: '3.10',
      total_commission_fee: '0.00',
      total_commission_rate: '3.10',
      trade_id: '1035627073963385052',
      trade_parent_id: '1035627073963385052'
    },
    {
      adzone_id: 110160350186,
      adzone_name: '爱分享',
      alimama_rate: '0.00',
      alimama_share_fee: '0.00',
      alipay_total_price: '269.00',
      click_time: '2020-05-29 07:41:53',
      deposit_price: '0.00',
      flow_source: '优品推广-权益',
      income_rate: '0.75',
      item_category_name: '运动/瑜伽/健身/球迷用品',
      item_id: 601442927963,
      item_img: '//img.alicdn.com/tfscom/i1/222685818/O1CN01CMkGNX1sqgroe8J2E_!!222685818.jpg',
      item_link: 'http://item.taobao.com/item.htm?id=601442927963',
      item_num: 1,
      item_price: '755.00',
      item_title: '【狂欢价】美洲狮成人轮滑鞋大学生社团初学溜冰鞋成年男女可调直排轮旱冰鞋',
      order_type: '天猫',
      pub_id: 675740190,
      pub_share_fee: '0.00',
      pub_share_pre_fee: '2.02',
      pub_share_rate: '100.00',
      refund_tag: 0,
      seller_nick: '美洲狮旗舰店',
      seller_shop_title: '美洲狮旗舰店',
      site_id: 1426800082,
      site_name: '',
      subsidy_fee: '0.00',
      subsidy_rate: '0.00',
      subsidy_type: '--',
      tb_deposit_time: '--',
      tb_paid_time: '2020-06-01 14:33:06',
      terminal_type: '无线',
      tk_commission_fee_for_media_platform: '0.00',
      tk_commission_pre_fee_for_media_platform: '0.00',
      tk_commission_rate_for_media_platform: '0.00',
      tk_create_time: '2020-06-01 14:33:26',
      tk_deposit_time: '--',
      tk_order_role: 3,
      tk_paid_time: '2020-06-01 14:33:36',
      tk_status: 13,
      tk_total_rate: '0.75',
      total_commission_fee: '0.00',
      total_commission_rate: '0.75',
      trade_id: '1035678978614181441',
      trade_parent_id: '1035678978614181441'
    }
  ];
// let testStr = '复制这段话₴1q0z1r54E6B₴转移至氵匋宝【米高SEBA新款EB成人花式轮滑鞋溜冰鞋成年男女平花鞋直排轮旱冰鞋】';
// let a = new RegExp('₴[\\w]*₴').exec(testStr)
// console.log(a)
// console.log(a[0])
// tkltest(a[0])

// // console.log('1111')


//   console.log(jiexiGoodsIdByUrl("https://item.taobao.com/item.htm?ut_sk=1.XdJ/4ibgnpADAIqwVNpcwgCi_21380790_1590504919802.Copy.1&id=2630472546&sourceType=item&price=168-245&origin_price=406-624&suid=168855B3-6F04-4F0B-9D90-8FB2FAC6F210&shareUniqueId=388658591&un=efdd5cfb0af2ca01bbeeeafdb2768e28&share_crt_v=1&spm=a2159r.13376460.0.0&sp_tk=4oKkZUo4WTFyVzA5cUzigqQ="))