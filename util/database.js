const mysql = require('mysql2')

const config = {
  host: 'localhost',
  user: 'root',
  database: 'nodejs-complete-guide',
  password: 'password',
}

const pool = mysql.createPool(config)

module.exports = pool.promise()
