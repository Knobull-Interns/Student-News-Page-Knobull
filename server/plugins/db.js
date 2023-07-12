// This is our module for connecting MongoDB database using mongoose.
// We exported this as a function so that when called, it connects MongoDB database.
// Mongoose is used as the driver, more than that, we used it to pre define schema, as well as use the model

// For Future Interns: don't worry about the mongoose syntax, I just look it up at: mongoosejs.com LOL -Jahong
module.exports = () => {
  const mongoose = require("mongoose");
  mongoose.connect("mongodb://127.0.0.1:27017/news", {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
  });
  // require("require-all")(__dirname + "/../models");
  // This commented out code can be used for multiple model files. 
};