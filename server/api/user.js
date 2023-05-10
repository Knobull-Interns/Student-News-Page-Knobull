const express = require('express')
const router = express.Router()
const db = require('../db/db.js')
const rand = require('csprng')
const sha1 = require('sha1')

// 修改账户
router.post('/api/user', (req, res) => {
    const salt = rand(160, 36)
    const user = {
        salt: salt,
        name: req.body.name,
        password: sha1(req.body.password + salt)
    }
    db.User.update({_id: req.body.id}, user, (err) => {
        if (err) {
            console.log(err)
        } else {
            res.status(200).send('update successfully')
        }
    })
})

// 获取用户
router.get('/api/user', async (req, res) => {
    const page = req.query.page
    const limit = req.query.limit - 0 || 8
    const skip = limit * (page - 1)
    const count = await db.User.count({userType: req.query.userType})
    const data = await db.User.find({userType: req.query.userType}).limit(limit).skip(skip)
    const obj = {
        total: count,
        data
    }
    res.status(200).send(obj)
})

// 改变用户
router.get('/api/changeUser', async (req, res) => {
    const id = req.query.id
    const type = req.query.userType
    await db.User.update({_id: id}, {$set: {userType: type}})
    res.status(200).send('success')
})

// 删除用户
router.get('/api/deleteUser', async (req, res) => {
    const id = req.query.id
    await db.User.deleteOne({_id: id})
    res.status(200).send('success')
})

// 获取用户
router.get('/api/userInfo', async (req, res) => {
  const id = req.query.id
  const userInfo = await db.User.find({_id: id})
  res.status(200).send(userInfo)
})

module.exports = router
