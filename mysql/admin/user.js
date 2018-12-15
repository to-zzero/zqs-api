module.exports = function (query) {
  return {
    login (params) {
      const username = params.username
      const pwd = params.pwd
      const sql = `select * from admin_users where name="${username}"`
      return query(sql)
    },
    loginOut (params) {
      const sql = `select * from admin_users where id="${params.id}"`
      return query(sql)
    },
    addUser (params) {
      const username = params.username
      const pwd = params.pwd
      const sql = `insert into admin_users(id,name,pwd,phone,country) VALUES(NULL,?,?,NULL,NULL)`
      return query(sql, [username, pwd])
    },
    deleteUser (id) {
      const sql = `delete from admin_users where id=${id}`
      return query(sql)
    },
    getUserInfo (id) {
      const sql = `select * from admin_users where id="${id}"`
      return query(sql)
    },
    async queryUser (id) {
      const sql = `select * from admin_users where id=${id}`
      return query(sql)
    },
    queryUsers ({ page, size }) {
      const currentCount = (page  - 1) * size
      const sql = `select id,name,country,phone from admin_users limit ${currentCount},${size}; select count(*) from admin_users;`
      return query(sql)
    }
  }
}
