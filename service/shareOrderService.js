const BaseService =require('./baseService.js')
const {AutoWritedShareOrderModel} =require('../dao/model/AutoWrite.js')
// @AutoWritedShareOrderModel
class ShareOrderService extends BaseService{
	constructor(){
        AutoWritedShareOrderModel(ShareOrderService)//替代装饰器
		super(ShareOrderService.model)
	}
}
module.exports = new ShareOrderService()