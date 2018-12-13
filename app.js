const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const historyApiFallback = require('koa2-connect-history-api-fallback')
const cors = require('koa2-cors')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')

const routesMap = require('./routes/index').routesMap
const {verifyList, allowRoutes} = require('./config/need_verify_token_list.js')
const {tips} = require('./until/tips.js')

// error handler
onerror(app)

const historyWhiteList = [
  '/',
  '/user',
  '/admin'
]

// middlewares
app.use(cors())
app.use(historyApiFallback({ whiteList: historyWhiteList }))
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

function verifyToken(token) {
  let cert = fs.readFileSync(path.join(__dirname, './config/rsa_public_key.pem')) // 公钥
  let res = {}
  try {
    let result = jwt.verify(token, cert, {algorithms: ['RS256']}) || {}
    let {exp = 0} = result,current = Math.floor(Date.now() / 1000)

    if(current <= exp){
      res = result.data || {}
    }
  } catch(e){
    console.log(e)
  }
  return res
}

// logger
app.use(async (ctx, next) => {
  ctx.set("Access-Control-Allow-Methods", 'get,post')
  ctx.set("access-control-allow-credentials", true)
  ctx.set("Access-Control-Max-Age", 172800)

  const {url = ''} = ctx
  const data = url.split('/')
  const resultUrl = data.length >= 1 ? `/${data[1]}` : url

  if (verifyList.indexOf(resultUrl) > -1 && !allowRoutes.includes(url)) { // 需要校验登录态
    let header = ctx.request.header
    let {autumntoken} = header

    if (autumntoken) {
      let result = verifyToken(autumntoken)
      let {uid} = result
      if (uid) {
        ctx.state = {uid}
        await next()
      } else {
        return ctx.body = tips[1002]
      }
    } else {
      return ctx.body = tips[1003]
    }
  } else {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
  }
})

// routes
routesMap.forEach(routeItem => {
  app.use(routeItem.routes(), routeItem.allowedMethods())
})
// app.use(index.routes(), index.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
