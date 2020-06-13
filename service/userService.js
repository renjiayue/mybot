const BaseService =require('./baseService.js')
const {AutoWritedUserModel} =require('../dao/model/AutoWrite.js')
// @AutoWritedUserModel
class UserService extends BaseService{
	constructor(){
        AutoWritedUserModel(UserService)//替代装饰器
        super(UserService.model)
	}
}
module.exports = new UserService()