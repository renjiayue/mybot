module.exports={
    //机器人相关
    bot:{
        token:'puppet_padplus_****',
        name:'myWechatyBot1',
    },
    database:{
        database:'****',
        user: '****',
        pwd: '****',
        host:'****',
    },
    //淘宝客相关
    tbk:{
        client:{
            appkey:'****',
            appsecret:'****',
            REST_URL:'http://gw.api.taobao.com/router/rest'
        },
        adzone_id:'****',
    },
    //server酱相关
    //http://sc.ftqq.com/
    ServerChan:{
        key:'****',
        serverUrl:'****',//已经拼接key的url
    },

    //第三方tbk工具
    //https://www.taokouling.com/
    //授权地址 http://taobao.taokouling.com 每月1号授权
    taokoulingCom:{
        apikey:'****',
        tkljmUrl:' https://api.taokouling.com/tkl/tkljm',
        taobao_user_id:'****',
        order_details_get:'https://api.taokouling.com/tbk/TbkScOrderDetailsGet',//服务商订单查询接口 参数参照 https://open.taobao.com/api.htm?docId=43755&docType=2
    },

    //第三方tbk工具
    //http://api.tkurl.top
    //暂时用于取商品id
    tkurlTop:{
        url:'http://api.tkurl.top/api/alimama/tpwd_convert',
        appkey:'****',
    }


}