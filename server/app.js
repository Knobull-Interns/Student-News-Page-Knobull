const express = require("express");
const bodyParser = require("body-parser");
const route = require("./api/index.js");
const { expressjwt: jwt } = require("express-jwt");
const secret = require("./config").jwt;
const cors = require("cors");

const app = express();
app.use(cors());

app.set("port", process.env.port || 3003);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"));

// Use JWT for authentication
app.use(
  jwt({ secret, algorithms: ["HS256"] }).unless({
    path: ["/api/login", "/api/getPhoneCode"],
  })
);

// Middleware for handling errors
app.use((err, req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (
    req.originalUrl.indexOf("api") === -1 ||
    res.req.rawHeaders.filter((item) => item.indexOf("/front") !== -1).length >
      0
  ) {
    return next();
  }
  if (err.name === "UnauthorizedError") {
    return res.send({
      status: 401,
      message: "Invalid token",
    });
  }
  res.send({
    status: 500,
    message: "Unknow error",
  });
  next();
});

route(app);

app.listen(app.get("port"), function () {
  console.log(
    "Backend service is running at：http://localhost:" + app.get("port")
  );
});
