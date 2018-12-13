module.exports = function (pool) {
  return {
    query (sql, values) {
      return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
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
    add (sql, values) {
      return new Promise((resolve, reject) => {
        pool.getConnection((err, c) => {
          if (err) {
            reject(err)
          }
          c.query(sql, values, (err, res) => {
            console.log(err, res)
            resolve(res)
          })
        })
      })
    },
    selectId (id) {
      const sql = `select * from admin_users where id=${id || '10000'}`
      return this.query(sql)
    },
    addUser (params) {
      // const sql = `select * from users where id=${'10000'}`
      const sql = `insert into admin_users(id,name,pwd) VALUES(NULL, ?,?)`
      const values = ['123', '123123121233']
      return this.add(sql, values)
    }
  }
}
