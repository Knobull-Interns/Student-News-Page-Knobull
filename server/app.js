const express = require('express')
const bodyParser = require('body-parser')
const route = require('./api/index.js')
const { expressjwt: jwt } = require('express-jwt')
const secret = require('./config').jwt
const cors = require('cors')

const app = express()
app.use(cors())

app.set('port', process.env.port || 3003)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.static(__dirname + '/public'))

app.use(jwt({ secret, algorithms: ['HS256'] }).unless({ path: ['/api/login', '/api/getPhoneCode'] }))

app.use((err, req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.originalUrl.indexOf('api') === -1) {
    return next()
  }
  if (err.name === 'UnauthorizedError') {
    return res.send({
      status: 401,
      message: '无效的token'
    })
  }
  res.send({
    status: 500,
    message: '未知的错误'
  })
  next()
})

route(app)

app.listen(app.get('port'), function () {
  console.log('后台服务已运行：http://localhost:' + app.get('port'))
})
