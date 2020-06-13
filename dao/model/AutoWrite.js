//模拟工厂模式，给每个target的原型上注入新属性
module.exports = {
	AutoWritedOrderModel(target, key, descriptor){
		target.model = require('../model/orderModel')
		target.shareModel = require('../model/shareModel')
		target.shareOrderModel = require('../model/shareOrderModel')
		target.userModel = require('../model/userModel')
	},
	AutoWritedShareModel(target, key, descriptor){
		target.model = require('../model/shareModel')
	},
	AutoWritedShareOrderModel(target, key, descriptor){
		target.model = require('../model/shareOrderModel')
	},
	AutoWritedUserModel(target, key, descriptor){
		target.model = require('../model/userModel')
	},
}