const user = require('./user')

module.exports = function (pool, params = {}) {
  const {query, add} = params
  return {
    user: user(query, add)
  }
}
