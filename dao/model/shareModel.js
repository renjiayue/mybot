const Sequelize = require('sequelize')
const BaseModel = require('./baseModel.js')
class ShareModel extends BaseModel{
	constructor(){
		super('tb_shares', {
			user_id:{type: Sequelize.INTEGER},
			item_id:{type: Sequelize.STRING},
			// 时间戳
			// createdAt: Sequelize.DATE,
			// updatedAt: Sequelize.DATE,
		})
		this.model = super.getModel()
		this.model.sync()
	}
}
module.exports = new ShareModel()