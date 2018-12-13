const admin = require('./admin')
const user = require('./user.js')

const result = {
  routesMap: [
    user
  ]
}

for (let k in admin) {
  result.routesMap.push(admin[k])
}

module.exports = result
