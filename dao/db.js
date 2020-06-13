const Sequelize = require('sequelize')
const botConfig = require('../botConfig')

const sequelize = new Sequelize(botConfig.database['database'], botConfig.database['user'], botConfig.database['pwd'], {
	host:botConfig.database['host'],
	dialect: 'mysql',
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	  }
	})
sequelize.authenticate().then(() => {
    console.log('数据库连接成功...')
}).catch(err => {console.error('数据库连接失败...', err)})
module.exports = sequelize