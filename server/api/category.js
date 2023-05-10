const express = require('express')
const router = express.Router()
const db = require('../db/db.js')

// 添加分类
router.post('/api/category', async (req, res) => {
    const name = req.body.name
    const count = await db.Category.count({name: name})
    if (count !== 0) {
        res.status(200).send('分类已存在')
        return
    }
    db.Category({name: name}).save().then(res1 => {
        res.status(200).send('添加分类成功')
    })
})

// 删除分类
router.get('/api/deleteCategory', async (req, res) => {
    const id = req.query.id
    db.Category.remove({_id: id}).then(res1 => {
        res.status(200).send('删除分类成功')
    })
})

// 获取分类
router.get('/api/category', async (req, res) => {
    const data = await db.Category.find()
    const obj = {
        data
    }
    res.status(200).send(obj)
})

// 改变分类
router.post('/api/editCategory', async (req, res) => {
    const id = req.body.id
    const name = req.body.name
    await db.Category.update({_id: id}, {$set: {name}})
    res.status(200).send('success')
})

module.exports = router
