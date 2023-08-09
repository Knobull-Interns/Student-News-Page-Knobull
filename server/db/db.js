// This is our file for setting up MongoDB database connection with Mongoose and preset
// the schemas for : user, category, article, and pay.

//require the dotenv for mongodb connection
require("dotenv").config({ path: __dirname + "/../../.env" });

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const sha1 = require("sha1");
const rand = require("csprng");
// const Sequence = require('./sequence')

// Data Schemas for User
const UserSchema = new Schema(
  {
    name: String,
    password: String,
    salt: String, // Salt generated using csprng
    userType: Number,
    avatar: String,
    collectArticle: Array,
    collectComment: Array,
  },
  { versionKey: false }
);
// Data Schemas for Category
const CategorySchema = new Schema(
  {
    name: String,
  },
  { versionKey: false }
);
// Data Schemas for Article
const ArticleSchema = new Schema(
  {
    title: String,
    desc: String,
    categoryId: {
      ref: "Category",
      type: Schema.Types.ObjectId,
    },
    charge: Number,
    banner: String,
    content: String,
  },
  { versionKey: false }
);
// Data Schemas for Pay
const PaySchema = new Schema(
  {
    userId: String,
    articleId: String,
  },
  { versionKey: false }
);

// This Models obeject maps strings to Mongoose models(collections) based on the schemas above 👆
const Models = {
  User: mongoose.model("User", UserSchema),
  Article: mongoose.model("Article", ArticleSchema),
  Category: mongoose.model("Category", CategorySchema),
  Pay: mongoose.model("Pay", PaySchema),
};

// initialize data
const initialize = () => {
  console.log("beginning to initialize data...");
  Models.User.find({}, (err, doc) => {
    if (err) {
      console.log(err);
      console.log("initialize failed");
    } else if (!doc.length) {
      const salt = rand(160, 36);
      // first time create admin account
      new Models["User"]({
        name: "admin",
        password: sha1("123456" + salt),
        salt: salt,
        userType: 1,
        avatar: "https://demo.buildadmin.com/static/images/avatar.png",
      }).save();
      console.log("initialize successfully");
    } else {
      console.log("initialize successfully");
    }
  });
};

mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;

// Simple error handling
db.on("error", console.error.bind(console, "Database connection error."));
db.once("open", () => {
  console.log("The database has connected.");
  initialize();
});

module.exports = Models;
