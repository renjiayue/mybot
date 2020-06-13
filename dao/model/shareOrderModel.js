const Sequelize = require('sequelize')
const BaseModel = require('./baseModel.js')
class ShareOrderModel extends BaseModel{
	constructor(){
		super('tb_share_orders', {
			user_id:{type: Sequelize.INTEGER},
			item_id:{type: Sequelize.STRING},
			trade_id: {type: Sequelize.STRING},//子订单号 唯一
			//淘客订单状态，12-付款，13-关闭，14-确认收货，3-结算成功;不传，表示所有状态
			tk_status: {type: Sequelize.INTEGER},
			pub_share_fee: {type: Sequelize.STRING},//结算预估收入
			pub_share_pre_fee: {type: Sequelize.STRING},//付款预估收入
			refund_tag: {type: Sequelize.INTEGER},//维权标签，0 含义为非维权 1 含义为维权订单
		})
		this.model = super.getModel()
		this.model.sync()
	}
}
module.exports = new ShareOrderModel()