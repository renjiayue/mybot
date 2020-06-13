const botConfig = require('./botConfig')

// node-request请求模块包
const request = require("request")
// 请求参数解码
//const urlencode = require("urlencode")

module.exports={
    thirdPartyTkljxToId: function(tklContent){
        console.log('tklContent',tklContent)
        return new  Promise(function(resolve,reject){
            request({
                url: botConfig.tkurlTop.url,
                method: "GET",
                json: true,
                async:false,
                headers: {
                    "content-type": "application/x-www-form-urlencoded"
                },
                body: "appkey="+botConfig.tkurlTop.appkey+"&content="+tklContent
            }, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log('')
                    console.log(body) // 请求成功的处理逻辑
                    resolve(body.num_iid)
                }else{
                    console.log('server酱消息发送失败')
                }
            });
    
        })
    },
}
