const BaseService =require('./baseService.js')
const {AutoWritedShareModel} =require('../dao/model/AutoWrite.js')
// @AutoWritedShareModel
class ShareService extends BaseService{
	constructor(){
        AutoWritedShareModel(ShareService)//替代装饰器
		super(ShareService.model)
	}

	async insertOrUpdateShare(share){
		let oldShare = await ShareService.model.findByFilter(null,{user_id:share.user_id,item_id:share.item_id})
		if(oldShare && oldShare[0]){
			console.log('更新share')
			await ShareService.model.update({item_id:share.item_id},{user_id:share.user_id,item_id:share.item_id})
		}else{
			console.log('新增share')
			await ShareService.model.create(share)
		}
	}
}
module.exports = new ShareService()