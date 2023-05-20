const express = require('express')
const router = express.Router()
const secret = require('../config').jwt
const jwt = require('jsonwebtoken')
const db = require('../db/db.js')
const sha1 = require('sha1')
const rand = require('csprng')
const formidable = require('formidable')
const path = require('path')

const createToken = (id, name) => {
  return 'Bearer ' + jwt.sign(
    {
      id: id,
      name: name
    },
    secret,
    { expiresIn: '7d' }
  )
}

function phoneCode(n) {
  var randomNum = ''
  for (var i = 0; i < n; i++) {
    randomNum += Math.floor(Math.random() * 10)
  }
  return randomNum
}

const obj = {}

router.get('/api/getPhoneCode', (req, res) => {
  const phone = req.query.phone
  const code = phoneCode(6)
  obj[phone] = code
  res.status(200).send({
    code
  })
})

router.post('/api/login', (req, res) => {
  db.User.findOne({ name: req.body.name }, (err, doc) => {
    if (err) {
      console.log(err)
    } else if (doc) {
      if (req.body.type === 'user') {
        // 用户登录
        if (obj[req.body.name] !== req.body.code) {
          res.status(200).send({ status: 1, message: 'The verification code of the mobile phone is incorrect' })
          return
        }
        const salt = doc.salt
        if (doc.password === sha1(req.body.password + salt)) {
          const token = createToken(doc._id, doc.name)
          res.status(200).send({
            id: doc._id,
            name: doc.name,
            token: token,
            avatar: doc.avatar,
            userType: doc.userType,
            collectArticle: doc.collectArticle,
            collectComment: doc.collectComment
          })
        } else {
          res.status(200).send({
            status: 1,
            message: 'Incorrect password'
          })
        }
      } else {
        // 管理员登录
        const salt = doc.salt
        if (doc.userType !== 1) {
          res.status(200).send({
            status: 1,
            message: 'The user is not an administrator'
          })
        } else if (doc.password === sha1(req.body.password + salt)) {
          const token = createToken(doc._id, doc.name)
          res.status(200).send({
            status: 0,
            message: 'Login success',
            token,
            data: {
              account: doc.name,
              type_id: 1,
              user_id: doc._id,
              username: doc.name,
              avatar: doc.avatar,
              collectArticle: doc.collectArticle,
              collectComment: doc.collectComment
            }
          })
          /* res.status(200).send({
            id: doc._id,
            name: doc.name,
            token: token,
            avatar: doc.avatar,
            userType: doc.userType,
            collectArticle: doc.collectArticle,
            collectComment: doc.collectComment
          }) */
        } else {
          res.status(200).send({
            status: 1,
            message: 'Incorrect password'
          })
        }
      }
    } else if (!doc) {
      if (req.body.type === 'user') {
        // 用户登录
        if (obj[req.body.name] !== req.body.code) {
          res.status(200).send({ status: 1, message: 'The verification code of the mobile phone is incorrect' })
          return
        }
        const salt = rand(160, 36)
        const user = {
          name: req.body.name,
          password: sha1(req.body.password + salt),
          salt,
          userType: 0,
          collectArticle: [],
          collectComment: [],
          avatar: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2719292398,3645159946&fm=26&gp=0.jpg'
        }
        new db.User(user).save().then(user => {
          const doc1 = user._doc
          const token = createToken(doc1._id, doc1.name)
          res.status(200).send({
            id: doc1._id,
            name: doc1.name,
            token: token,
            avatar: doc.avatar,
            userType: doc.userType,
            collectArticle: doc.collectArticle,
            collectComment: doc.collectComment
          })
        })
      } else {
        res.status(200).send({
          status: 1,
          message: 'The administrator account does not exist'
        })
      }
    }
  })
})

router.get('/api/getAdminAvatar', (req, res) => {
  db.User.findOne({}, (err, doc) => {
    res.status(200).send({
      url: doc._doc.avatar
    })
  })
})

router.post('/api/changePas', (req, res) => {
  const salt = rand(160, 36)
  const params = {
    password: sha1(req.body.password + salt),
    salt
  }
  db.User.updateOne({ name: req.body.name }, params, (err, data) => {
    res.status(200).end()
  })
})

router.post('/api/changeAvatar', (req, res) => {
  const params = {
    avatar: req.body.avatar
  }
  db.User.update({ name: req.body.name }, params, (err, data) => {
    res.status(200).send({
      url: req.body.avatar
    })
  })
})

router.post('/api/upload', (req, res) => {
  const form = new formidable.IncomingForm()
  form.uploadDir = path.join(__dirname, '../public') // 上传图片放置的文件夹
  form.keepExtensions = true
  form.parse(req, (err, fields, files) => {
    console.log(files.files.originalFilename.substring(files.files.originalFilename.lastIndexOf('.') + 1))
    const index = files.files.filepath.lastIndexOf('\\')
    const fileType = files.files.originalFilename.substring(files.files.originalFilename.lastIndexOf('.') + 1)
    const imgUrl = `http://localhost:3003/${files.files.filepath.substring(index + 1)}.${fileType}`
    res.status(200).send({ message: imgUrl })
  })
})

module.exports = router
