const router = require('koa-router')()
const allServers = require('../../mysql')
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const {tips, success} = (require('../../until')).tips

// 生成token的方法
function generateToken(data, exp){
  let created = Math.floor(Date.now() / 1000)
  let cert = fs.readFileSync(path.join(__dirname, '../../config/rsa_private_key.pem')) // 私钥
  let token = jwt.sign({
    data,
    exp: exp ? 0 : (created + 3600 * 1)
  }, cert, {
    algorithm: 'RS256'
  })
  return token
}

function verifyToken(token) {
  let cert = fs.readFileSync(path.join(__dirname, '../../config/rsa_public_key.pem')) // 公钥
  let res = {}
  let a = {}
  try {
    let result = jwt.verify(token, cert, {algorithms: ['RS256']}) || {}
    let {exp = 0} = result,current = Math.floor(Date.now() / 1000)
    if(current <= exp){
      res = result.data || {}
      a = result
    }
  } catch(e){
    console.log(e)
  }
  return res
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
        name: result.name,
        country: result.country,
        phone: result.phone,
        id: result.id,
        token
      }
    }
  })
})

router.post('/login_out', async (ctx, next) => {
  const token = ctx.header.autumntoken
  const id = (verifyToken(token) || {}).uid
  if (!id) {
    ctx.body = tips[1002]
  } else {
    await allServers.admin.user.loginOut({
      id
    }).then(res => {
      if (!res[0]) {
        ctx.body = tips[1011]
      } else {
        const token = generateToken({uid: res[0].id}, true)
        ctx.body = success[1001]
      }
    })
  }
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

router.post('/delete_user', async (ctx, next) => {
  const {id} = ctx.request.body
  if (!id) {
    ctx.body = tips[1012]
  } else if (id === 10000) {
    ctx.body = tips[1014]
  } else {
    const user = await allServers.admin.user.queryUser(id)
    // console.log(user)
    if (!user[0]) {
      ctx.body = tips[1011]
    } else {
      await allServers.admin.user.deleteUser(id).then(res => {
        if (res.affectedRows) {
          ctx.body = success[1002]
        } else {
          ctx.body = tips[1013]
        }
      })
    }
  }
})

router.post('/get_user_info', async function (ctx, next) {
  const token = ctx.header.autumntoken
  const id = (verifyToken(token) || {}).uid
  if (!id) {
    ctx.body = tips[1002]
  } else {
    await allServers.admin.user.getUserInfo(id).then(res => {
      if (res.length === 0) {
        ctx.body = tips[1010]
      } else {
        ctx.body = {
          name: res[0].name,
          country: res[0].country,
          id: res[0].id,
          phone: res[0].phone
        }
      }
    })
  }
})

router.post('/query_users', async function (ctx, next) {
  const {page, size} = ctx.request.body
  // console.log(page, size)
  await allServers.admin.user.queryUsers({page, size}).then(res => {
    if (res.length === 0) {
      ctx.body = tips[1010]
    } else {
      // console.log(res)
      ctx.body = {
        items: res[0],
        count: res[1][0]['count(*)'],
        page
      }
    }
  })
})

module.exports = router
