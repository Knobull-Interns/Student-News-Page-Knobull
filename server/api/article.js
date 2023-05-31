const express = require('express')
const router = express.Router()
const db = require('../db/db.js')

// 发布文章
router.post('/api/article', (req, res) => {
  const { title, desc, categoryId, charge, banner, content } = req.body
  const article = {
    title,
    desc,
    categoryId,
    charge,
    banner,
    content
  }
  db.Article(article)
    .save()
    .then((res1, err) => {
      res.status(200).send({ status: 0, message: 'succeed in saving new article' })
    })
})

// 编辑文章
router.post('/api/editArticle', (req, res) => {
  const { id, title, desc, categoryId, charge, banner, content } = req.body
  const article = {
    title,
    desc,
    categoryId,
    charge,
    banner,
    content
  }
  db.Article.updateOne({ _id: id }, article, (err, data) => {
    if (err) {
      console.log(err)
    } else {
      res.status(200).send({ status: 0, message: 'succeed in updating ---' + title })
    }
  })
})

// 删除文章
router.get('/api/deleteArticle', async (req, res) => {
  const id = req.query.id
  db.Article.remove({ _id: id }).then(res1 => {
    res.status(200).send({ status: 0, message: 'Deleting a article succeeded' })
  })
})

// 获取某篇文章
router.get('/api/getArticleDetail', (req, res) => {
  db.Article.findOne({ _id: req.query.id }, (err, doc) => {
    if (err) {
      console.log(err)
    } else {
      console.log(doc)
      res.status(200).send({ status: 0, data: doc })
    }
  })
})

// 更新文章
router.patch('/api/article/:aid', (req, res) => {
  const aid = req.params.aid
  const article = {
    title: req.body.title,
    tags: req.body.tags,
    category: req.body.category,
    date: Date(),
    content: req.body.content,
    isPublish: true
  }
  db.Article.update({ aid: aid }, article, (err, data) => {
    if (err) {
      console.log(err)
    } else {
      res.status(200).send('succeed in updating ---' + data.title)
    }
  })
})

// 获取很多文章
router.get('/api/articles', (req, res) => {
  const page = req.query.page
  const limit = req.query.pageSize || 10
  const skip = limit * (page - 1)
  const params = {}
  if (req.query.categoryId) {
    params.categoryId = req.query.categoryId
  }
  db.Article.find(params)
      .populate('categoryId')
      .limit(limit * 1)
      .skip(skip)
      .then(async articles => {
        const count = await db.Article.find(params).count()
        res.send({ status: 0, total: count, data: articles })
      })
})

// 搜索一些文章
router.get('/api/someArticles', (req, res) => {
  const key = req.query.payload.key
  const value = req.query.payload.value
  const page = req.query.payload.page || 1
  const skip = 4 * (page - 1)
  const re = new RegExp(value, 'i')
  if (key === 'tags') {
    // 根据标签来搜索文章
    db.Article.find({ tags: { $elemMatch: { $eq: value } } })
      .sort({ date: -1 })
      .limit(4)
      .skip(skip)
      .exec()
      .then(articles => {
        res.send(articles)
      })
  } else if (key === 'title') {
    // 根据标题的部分内容来搜索文章
    db.Article.find({ title: re, isPublish: true })
      .sort({ date: -1 })
      .limit(4)
      .skip(skip)
      .exec()
      .then(articles => {
        res.send(articles)
      })
  } else if (key === 'date') {
    // 根据日期来搜索文章
    const nextDay = value + 'T24:00:00'
    db.Article.find({ date: { $gte: new Date(value), $lt: new Date(nextDay) } })
      .sort({ date: -1 })
      .limit(4)
      .skip(skip)
      .exec()
      .then(articles => {
        res.send(articles)
      })
  }
})

// 收藏文章
router.post('/api/collectArticle', (req, res) => {
  const id = req.body.id
  const userId = req.body.userId
  const flag = req.body.flag
  if (flag === 1) {
    db.User.update({ _id: userId }, { $push: { collectArticle: id } }).then(res1 => {
      res.status(200).send({ message: '收藏成功' })
    })
  } else {
    db.User.update({ _id: userId }, { $pull: { collectArticle: id } }).then(res1 => {
      res.status(200).send({ message: '取消收藏成功' })
    })
  }
})

// 获取收藏文章列表
router.get('/api/collectArticle', (req, res) => {
  const id = req.query.id
  db.User.findOne({ _id: id }, (err, doc) => {
    db.Article.find({ aid: doc.collectArticle }, (err, doc1) => {
      res.status(200).send(doc1)
    })
  })
})

module.exports = router
