const botConfig = require('../botConfig')
var apiClient = require('../lib/api/topClient.js').TopClient;
ApiClient  = apiClient
var client = new ApiClient(botConfig.tbk.client);

async function testa(){

    var id = '601025084764'
    var title = '管道疏通剂强力通卫生间马桶地漏厕所神器厨房下水道油污堵塞'
    
    let page_size = 100
    let page_no = 0
    let queryTotleCount = page_size
    while(Math.ceil(queryTotleCount/page_size)>page_no){
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
                    let isExist = false;
                    console.log(response)
                    var dd = response.result_list.map_data
        
                    for(a in response.result_list.map_data){
                        // console.log(dd[a].item_id);
                        if(dd[a].item_id ==id){
                            console.log("查询到优惠信息",dd[a])
                            if(dd[a].coupon_share_url){
                            }
                        }
                    }
                    resolve()
                }
            })
        }
        )
    } 
}

testa()