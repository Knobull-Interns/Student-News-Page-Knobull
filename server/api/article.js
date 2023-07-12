// This our articles API routes.
// It has different handlers for different behaviors 

const express = require("express");
const router = express.Router();
const db = require("../db/db.js");

// post article
router.post("/api/article", (req, res) => {
  const { title, desc, categoryId, charge, banner, content } = req.body;
  const article = {
    title,
    desc,
    categoryId,
    charge,
    banner,
    content,
  };
  db.Article(article)
    .save()
    .then((res1, err) => {
      res
        .status(200)
        .send({ status: 0, message: "succeed in saving new article" });
    });
});

// edit article
router.post("/api/editArticle", (req, res) => {
  const { id, title, desc, categoryId, charge, banner, content } = req.body;
  const article = {
    title,
    desc,
    categoryId,
    charge,
    banner,
    content,
  };
  db.Article.updateOne({ _id: id }, article, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res
        .status(200)
        .send({ status: 0, message: "succeed in updating ---" + title });
    }
  });
});

// delete article
router.get("/api/deleteArticle", async (req, res) => {
  const id = req.query.id;
  db.Article.deleteOne({ _id: id }).then((res1) => {
    res
      .status(200)
      .send({ status: 0, message: "Deleting an article succeeded" });
  });
});

// get an article
router.get("/api/getArticleDetail", (req, res) => {
  db.Article.findOne({ _id: req.query.id }, (err, doc) => {
    if (err) {
      console.log(err);
    } else {
      console.log(doc);
      res.status(200).send({ status: 0, data: doc });
    }
  });
});

// update article
router.patch("/api/article/:aid", (req, res) => {
  const aid = req.params.aid;
  const article = {
    title: req.body.title,
    tags: req.body.tags,
    category: req.body.category,
    date: Date(),
    content: req.body.content,
    isPublish: true,
  };
  db.Article.update({ aid: aid }, article, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send("succeed in updating ---" + data.title);
    }
  });
});

// get more articles
router.get("/api/articles", (req, res) => {
  const page = req.query.page;
  const limit = req.query.pageSize || 10;
  const skip = limit * (page - 1);
  const params = {};
  if (req.query.categoryId) {
    params.categoryId = req.query.categoryId;
  }
  db.Article.find(params)
    .populate("categoryId")
    .limit(limit * 1)
    .skip(skip)
    .then(async (articles) => {
      const count = await db.Article.find(params).count();
      res.send({ status: 0, total: count, data: articles });
    });
});

// search for some articles
router.get("/api/someArticles", (req, res) => {
  const key = req.query.payload.key;
  const value = req.query.payload.value;
  const page = req.query.payload.page || 1;
  const skip = 4 * (page - 1);
  const re = new RegExp(value, "i");
  if (key === "tags") {
    // search article based on tag
    db.Article.find({ tags: { $elemMatch: { $eq: value } } })
      .sort({ date: -1 })
      .limit(4)
      .skip(skip)
      .exec()
      .then((articles) => {
        res.send(articles);
      });
  } else if (key === "title") {
    // search article based on a portion of the title
    db.Article.find({ title: re, isPublish: true })
      .sort({ date: -1 })
      .limit(4)
      .skip(skip)
      .exec()
      .then((articles) => {
        res.send(articles);
      });
  } else if (key === "date") {
    // search article based on date
    const nextDay = value + "T24:00:00";
    db.Article.find({ date: { $gte: new Date(value), $lt: new Date(nextDay) } })
      .sort({ date: -1 })
      .limit(4)
      .skip(skip)
      .exec()
      .then((articles) => {
        res.send(articles);
      });
  }
});

// collect/favoriate article
router.post("/api/collectArticle", (req, res) => {
  const id = req.body.id;
  const userId = req.body.userId;
  const flag = req.body.flag;
  if (flag === 1) {
    db.User.update({ _id: userId }, { $push: { collectArticle: id } }).then(
      (res1) => {
        res.status(200).send({ message: "Successfully collected!" });
      }
    );
  } else {
    db.User.update({ _id: userId }, { $pull: { collectArticle: id } }).then(
      (res1) => {
        res.status(200).send({ message: "Successfully uncollected!" });
      }
    );
  }
});

// get the list of collected articles
router.get("/api/collectArticle", (req, res) => {
  const id = req.query.id;
  db.User.findOne({ _id: id }, (err, doc) => {
    db.Article.find({ aid: doc.collectArticle }, (err, doc1) => {
      res.status(200).send(doc1);
    });
  });
});

// check if the article is paid
router.post("/api/isPayArticle", (req, res) => {
  const articleId = req.body.articleId;
  const userId = req.body.userId;
  db.Pay.findOne({ articleId, userId }, (err, doc) => {
    res.status(200).send({ result: !!doc });
  });
});

// pay for the article
router.post("/api/payArticle", (req, res) => {
  const articleId = req.body.articleId;
  const userId = req.body.userId;
  db.Pay({ articleId, userId })
    .save()
    .then(() => {
      res.status(200).send({ status: 0, message: "pay success!" });
    });
});
module.exports = router;
