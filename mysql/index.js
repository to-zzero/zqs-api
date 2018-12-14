const mysql = require('mysql')
const env = process.env.NODE_ENV || 'dev'
const config = require(`../config/${env}.js`)
const pool = mysql.createPool(config.database)
const userServer = require('./user/index.js')
const adminServer = require('./admin/index.js')

const params = {
  query: async function (sql, values) {
    return await new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        console.log(err, 11111)
        if (err) {
          reject(err)
        }
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err)
          } else {
            resolve(rows)
          }
          connection.release()
        })
      })
    })
  },
  add: async function (sql, values) {
    return await new Promise((resolve, reject) => {
      pool.getConnection((err, c) => {
        if (err) {
          reject(err)
        }
        c.query(sql, values, (err, res) => {
          if (err) {
            reject(err)
          }
          resolve(res)
          connection.release()
        })
      })
    })
  }
}

const allServers = {
  user: userServer(pool, params),
  admin: adminServer(pool, params)
}

module.exports = allServers
