module.exports = () => {
  const mongoose = require("mongoose");
  mongoose.connect("mongodb://127.0.0.1:27017/news", {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
  });
  require("require-all")(__dirname + "/../models");
};