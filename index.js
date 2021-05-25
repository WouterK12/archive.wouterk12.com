require("dotenv").config();

const express = require("express");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 5200;

// connect to the database
mongoose.connect("mongodb://localhost/minecraft_server_archive", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", function () {
  console.log("MongoDB database connection established");
});

module.exports = { authenticateToken, generateAccessToken };

// bodyParser
app.use(express.json()); // for parsing application/json
app.use(cookieParser());

// nginx
app.set("trust proxy", 1);
// rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// load routes
// authorization
// (the second parameter is middleware: limiter or first check if authorized, before continuing)
app.use("/login", limiter, require("./routes/authorization/login"));
app.use("/token", authenticateToken, require("./routes/authorization/token"));
app.use("/logout", authenticateToken, require("./routes/authorization/logout"));

// pages
app.use("/archive", authenticateToken, require("./routes/archive"));
app.use("/download", authenticateToken, require("./routes/download"));
// if already authenticated, redirect to archive

// enable CORS (https://enable-cors.org/server.html)
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// server static files
app.use(express.static("./client"));

// middleware
// check if token is valid
function authenticateToken(req, res, next) {
  // httpOnly cookie (not accessible from client)
  let tokens = req.cookies.token;
  if (tokens == null) return res.status(401).redirect("/");

  tokens = JSON.parse(tokens);

  jwt.verify(
    tokens.accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    (err, user) => {
      if (err) return res.status(403).redirect("/");
      req.user = user;
      req.tokens = tokens;
      next();
    }
  );
}

// generate a new accesstoken (on login)
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

// start server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
