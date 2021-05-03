const botConfig = require('./botConfig')

// node-request请求模块包
const request = require("request")
// 请求参数解码
const urlencode = require("urlencode")
const crypto = require('crypto');
const { dataoke } = require('./botConfig');

module.exports={
    //不再使用 收费
    makeSign: function($data, $appSecret) {

        let $str = '';
        let $index = 0;
        let $sortPor = [];
    
        for (let key in $data) {
            $sortPor.push(`${key}=${$data[key]}`);
        }
        // 排序
        $sortPor.sort();
    
        // 转url
        for (let key in $sortPor) {
            $str =`${$str}${$index === 0 ? '' : '&'}${$sortPor[key]}`;
            $index++;
        }
    
        const md5 = crypto.createHash('md5');
        // md5加密
        const $ret = md5.update(`${$str}&key=${$appSecret}`).digest('hex');
    
        return $ret;
    },
    //该方法用于测试,暂未使用
    getCategoryTop100: function() {

        const appSecret = dataoke.appSecret; //应用的Secret 
      
        const data = {
          version:dataoke.api.getCategoryTop100.version,// API接口版本号
          appKey:dataoke.appKey,// 应用分配的appKey
        };
        var options = { 
          url: `${dataoke.api.getCategoryTop100.url}?appKey=${data.appKey}&version=${data.version}&sign=${this.makeSign(data,appSecret)}`,  //请求地址
          method: 'GET',
        };
      
        return request(options, function(error, response, body) {
          if (!error && response.statusCode == 200) {
            //输出返回的内容
            console.log('接口调用成功',body);
          }else{
            //输出返回的内容
            console.log('接口调用失败',body);
          }
        })
        
      },
      parseTaokouling: function(taokoulingContent) {

        const appSecret = dataoke.appSecret; //应用的Secret 
      
        const data = {
          version:dataoke.api.parseTaokouling.version,// API接口版本号
          appKey:dataoke.appKey,// 应用分配的appKey
          content:taokoulingContent,
        };
        // let sign=this.makeSign(data,appSecret)
        // data.sign = sign
        console.log(data)
        var options = { 
          url: `${dataoke.api.parseTaokouling.url}?appKey=${data.appKey}&version=${data.version}&sign=${this.makeSign(data,appSecret)}&content=${data.content}`,  //请求地址
          method: 'GET'
        }
      
        return new  Promise(function(resolve,reject){
            request(options, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    //输出返回的内容
                    console.log('接口调用成功',body);
                    let bodyObj = JSON.parse(body)
                    if(bodyObj.code==0){
                        // console.log('resultData',bodyObj.data)
                        resolve(bodyObj.data)
                    }else{
                        resolve(null)
                    }
                }else{
                    // console.log('接口调用失败',error)
                    // console.log('接口调用失败',response)
                    //输出返回的内容
                    console.log('接口调用失败',body);
                    resolve(null)
                }
            })  
        })
        
      },
      //优先解析淘口令 而后 解析链接
      parseContent: function(content) {

        const appSecret = dataoke.appSecret; //应用的Secret 
      
        const data = {
          version:dataoke.api.parseContent.version,// API接口版本号
          appKey:dataoke.appKey,// 应用分配的appKey
          content:content,//文本内容
        };
        var options = { 
          url: `${dataoke.api.parseContent.url}?appKey=${data.appKey}&version=${data.version}&sign=${this.makeSign(data,appSecret)}&content=${data.content}`,  //请求地址
          method: 'GET',
        };
      
        return new  Promise(function(resolve,reject){
            request(options, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    //输出返回的内容
                    console.log('接口调用成功',body);
                    let bodyObj = JSON.parse(body)
                    if(bodyObj.code==0){
                        // console.log('resultData',bodyObj.data)
                        resolve(bodyObj.data)
                    }else{
                        resolve(null)
                    }
                }else{
                    //输出返回的内容
                    // console.log('接口调用失败',error)
                    // console.log('接口调用失败',response)
                    console.log('接口调用失败',body);
                    resolve(null)
                }
            })
        })
      },
      //公共解析淘口令或链接 优先解析淘口令
      commonParseContent: function(content) {
          console.log(urlencode(content))
        return new  Promise((resolve,reject)=>{
            this.parseTaokouling(content).then(
                (result)=>{
                    // console.log('成功回调接受的值：',result);
                    if(!result){
                        console.log('大淘客解析淘口令失败,使用万能解析开始')
                        this.parseContent(content).then((result2)=>{
                            // console.log('result2',result2)
                            resolve(result2) 

                        })
                    }else{
                        console.log('大淘客解析淘口令成功--------')
                        resolve(result)
                    }
                }
            )
        })
      },
      //淘口令转淘口令
      twdToTwd: function(content) {

        const appSecret = dataoke.appSecret; //应用的Secret 
      
        const data = {
          version:dataoke.api.twdToTwd.version,// API接口版本号
          appKey:dataoke.appKey,// 应用分配的appKey
          content:content,//文本内容
        };
        var options = { 
          url: `${dataoke.api.twdToTwd.url}?appKey=${data.appKey}&version=${data.version}&sign=${this.makeSign(data,appSecret)}&content=${data.content}`,  //请求地址
          method: 'GET',
        };
      
        return new  Promise(function(resolve,reject){
            request(options, function(error, response, body) {
              if (!error && response.statusCode == 200) {
                //输出返回的内容
                console.log('接口调用成功',body);
                let bodyObj = JSON.parse(body)
                if(bodyObj.code==0){
                    // console.log('resultData',bodyObj.data)
                    resolve(bodyObj.data)
                }else{
                    resolve(null)
                }
              }else{
                //输出返回的内容
                resolve(null)
                console.log('接口调用失败',body);
              }
            })
        })
      },
      //高效转链
      getPrivilegeLink: function(goodsId) {

        const appSecret = dataoke.appSecret; //应用的Secret 
      
        const data = {
          version:dataoke.api.getPrivilegeLink.version,// API接口版本号
          appKey:dataoke.appKey,// 应用分配的appKey
          goodsId:goodsId,//文本内容
        };
        var options = { 
          url: `${dataoke.api.getPrivilegeLink.url}?appKey=${data.appKey}&version=${data.version}&sign=${this.makeSign(data,appSecret)}&goodsId=${data.goodsId}`,  //请求地址
          method: 'GET',
        };
      
        return new  Promise(function(resolve,reject){
            request(options, function(error, response, body) {
              if (!error && response.statusCode == 200) {
                //输出返回的内容
                console.log('接口调用成功',body);
                let bodyObj = JSON.parse(body)
                if(bodyObj.code==0){
                    // console.log('resultData',bodyObj.data)
                    resolve(bodyObj.data)
                }else{
                    resolve(null)
                }
              }else{
                //输出返回的内容
                resolve(null)
                console.log('接口调用失败',body);
              }
            })
        })
      },

    }
    

    // require('./dataoke').getCategoryTop100()
    // require('./dataoke').parseTaokouling('$h4yaXW8qk2v$')
    // require('./dataoke').parseContent('$h4yaXW8qk2v$')
    // let a = require('./dataoke').twdToTwd('$h4yaXW8qk2v$')
    // console.log('a',a)
    console.log('￥K9IUXdOCQCw￥'.replace(/￥/g,'$'))
    // require('./dataoke').commonParseContent('$K9IUXdOCQCw$')
    

//   console.log(jiexiGoodsIdByUrl("https://item.taobao.com/item.htm?ut_sk=1.XdJ/4ibgnpADAIqwVNpcwgCi_21380790_1590504919802.Copy.1&id=2630472546&sourceType=item&price=168-245&origin_price=406-624&suid=168855B3-6F04-4F0B-9D90-8FB2FAC6F210&shareUniqueId=388658591&un=efdd5cfb0af2ca01bbeeeafdb2768e28&share_crt_v=1&spm=a2159r.13376460.0.0&sp_tk=4oKkZUo4WTFyVzA5cUzigqQ="))