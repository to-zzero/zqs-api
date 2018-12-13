module.exports = function (query) {
  return {
    login (params) {
      const username = params.username
      const pwd = params.pwd
      const sql = `select * from admin_users where name="${username}"`
      return query(sql)
    },
    addUser (params) {
      const username = params.username
      const pwd = params.pwd
      const sql = `insert into admin_users(id,name,pwd,phone,country) VALUES(NULL,?,?,NULL,NULL)`
      return query(sql, [username, pwd])
    },
    queryUsers ({ page, size }) {
      const currentCount = (page  - 1) * size
      const sql = `select id,name,country,phone from admin_users limit ${currentCount},${size}; select count(*) from admin_users;`
      return query(sql)
    }
  }
}
