const express = require("express");
const router = express.Router();
const db = require("../db/db.js");
const rand = require("csprng");
const sha1 = require("sha1");

// modify account
router.post("/api/user", (req, res) => {
  const salt = rand(160, 36);
  const user = {
    salt: salt,
    name: req.body.name,
    password: sha1(req.body.password + salt),
  };
  db.User.update({ _id: req.body.id }, user, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send("update successfully");
    }
  });
});

// get user
router.get("/api/user", async (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit - 0 || 8;
  const skip = limit * (page - 1);
  const count = await db.User.count({ userType: req.query.userType });
  const data = await db.User.find({ userType: req.query.userType })
    .limit(limit)
    .skip(skip);
  const obj = {
    total: count,
    data,
  };
  res.status(200).send(obj);
});

// change user
router.get("/api/changeUser", async (req, res) => {
  const id = req.query.id;
  const type = req.query.userType;
  await db.User.update({ _id: id }, { $set: { userType: type } });
  res.status(200).send("success");
});

// delete user
router.get("/api/deleteUser", async (req, res) => {
  const id = req.query.id;
  await db.User.deleteOne({ _id: id });
  res.status(200).send("success");
});

// get user information
router.get("/api/userInfo", async (req, res) => {
  const id = req.query.id;
  const userInfo = await db.User.find({ _id: id });
  res.status(200).send(userInfo);
});

// get user list
router.get("/api/getuserlist", (req, res) => {
  const page = req.query.page;
  const limit = req.query.pageSize || 10;
  const skip = limit * (page - 1);
  const params = {
    userType: 0,
  };
  db.User.find(params)
    .limit(limit * 1)
    .skip(skip)
    .then(async (articles) => {
      const count = await db.User.find(params).count();
      res.send({ status: 0, total: count, data: articles });
    });
});

module.exports = router;
