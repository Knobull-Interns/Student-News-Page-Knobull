// This is our module exports a set of router handlers for category operations

const express = require("express");
const router = express.Router();
const db = require("../db/db.js");

// add category
router.post("/api/category", async (req, res) => {
  const name = req.body.name;
  const count = await db.Category.count({ name: name });
  if (count !== 0) {
    res
      .status(200)
      .send({ status: 1, message: "Classification already exists" });
    return;
  }
  db.Category({ name: name })
    .save()
    .then((res1) => {
      res.status(200).send({ status: 0, message: "Class added successfully" });
    });
});

// delete category
router.get("/api/deleteCategory", async (req, res) => {
  const id = req.query.id;
  db.Category.remove({ _id: id }).then((res1) => {
    res.status(200).send({ status: 0, message: "Deleting a class succeeded" });
  });
});

// get category
router.get("/api/category", async (req, res) => {
  const data = await db.Category.find();
  const obj = {
    data,
  };
  res.status(200).send(obj);
});

// edit category
router.post("/api/editCategory", async (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const count = await db.Category.count({ name: name });
  if (count !== 0) {
    res
      .status(200)
      .send({ status: 1, message: "Classification already exists" });
    return;
  }
  await db.Category.updateOne({ _id: id }, { $set: { name } });
  res.status(200).send({ status: 0, message: "Class updated successfully" });
});

// get category information
router.get("/api/categoryInfo", async (req, res) => {
  const data = await db.Category.findOne({ _id: req.query._id });
  const obj = {
    data,
  };
  res.status(200).send(obj);
});

module.exports = router;
