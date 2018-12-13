const router = require('koa-router')()
const allServers = require('../mysql/index.js')

router.prefix('/user')

router.post('/', async function (ctx, next) {
  const result = await allServers.user.selectId('10000')
  ctx.body = result
})

router.post('/addUser', async function (ctx, next) {
  const params = ctx.params
  const result = await allServers.user.addUser(params)
  ctx.body = result
})

module.exports = router
