const botConfig = require('./botConfig')

// node-request请求模块包
const request = require("request")
// 请求参数解码
//const urlencode = require("urlencode")

module.exports={
    sendServerChanMsg:async function(text,desp){
        request({
            url: botConfig.ServerChan.serverUrl,
            method: "POST",
            json: true,
            async:false,
            headers: {
                "content-type": "application/x-www-form-urlencoded"
            },
            body: "text="+text+"&desp="+desp
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log('')
                console.log(body) // 请求成功的处理逻辑
            }else{
                console.log('server酱消息发送失败')
            }
        });
    }
}