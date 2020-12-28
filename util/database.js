const Sequelize = require('sequelize')

const sequelize = new Sequelize('nodejs-complete-guide', 'root', 'password', {
  dialect: 'mysql',
  host: 'localhost',
})

module.exports = sequelize
