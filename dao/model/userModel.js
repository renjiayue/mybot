const Sequelize = require('sequelize')
const BaseModel = require('./baseModel.js')
class UserModel extends BaseModel{
	constructor(){
		super('users', {
			wx_id:{type: Sequelize.STRING},
			tb_part_id:{type: Sequelize.STRING},
			income_radio:{type:Sequelize.DECIMAL(10, 2)},
			total_commission:{type:Sequelize.DECIMAL(10, 2)},
			comment:{type: Sequelize.STRING}
		})
		this.model = super.getModel()
		this.model.sync()
	}
}
module.exports = new UserModel()