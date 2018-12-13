const router = require('koa-router')()
const allServers = require('../../mysql')
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const {tips, success} = (require('../../until')).tips

// 生成token的方法
function generateToken(data){
  let created = Math.floor(Date.now() / 1000)
  let cert = fs.readFileSync(path.join(__dirname, '../../config/rsa_private_key.pem')) // 私钥
  let token = jwt.sign({
    data,
    exp: created + 3600 * 24
  }, cert, {
    algorithm: 'RS256'
  })
  return token
}

router.prefix('/admin/user')

router.post('/login', async (ctx, next) => {
  const {username, pwd} = ctx.request.body

  await allServers.admin.user.login({
    username,
    pwd
  }).then(res => {
    let result = res[0]
    if (!result) {
      ctx.body = tips[1000]
    } else if (result && result.pwd !== pwd) {
      ctx.body = tips[1001]
    } else {
      let token = generateToken({uid: result.id})
      // console.log(token)
      ctx.body = {
        ...result,
        token
      }
    }
  })
})

router.post('/addUser', async (ctx, next) => {
  const {username, pwd} = ctx.request.body
  if (username.length < 4) {
    ctx.body = tips[1006]
  } else if (username.length > 24) {
    ctx.body = tips[1007]
  } else if (pwd.length < 8) {
    ctx.body = tips[1008]
  } else if (pwd.length > 16) {
    ctx.body = tips[1009]
  } else {
    await allServers.admin.user.addUser({
      username,
      pwd
    }).then((res) => {
      if (res.insertId) {
        ctx.body = success[1000]
      } else {
        ctx.body = {
          ...res
        }
      }
    }).catch(err => {
      if (err.errno === 1062) {
        ctx.body = tips[1004]
      } else if (err.errno) {
        ctx.body = tips[1005]
      }
    })
  }
})

router.post('/query_users', async function (ctx, next) {
  const {page, size} = ctx.request.body
  await allServers.admin.user.queryUsers({page, size}).then(res => {
    if (res.length === 0) {
      ctx.body = tips[1010]
    } else {
      console.log(res)
      ctx.body = {
        items: res[0],
        count: res[1][0]['count(*)']
      }
    }
  })
})

module.exports = router
