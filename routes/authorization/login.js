const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const { generateAccessToken } = require("../../index");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");
const Token = require("../../models/Token");

// POST authenticate user
router.post("/", async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.sendStatus(400);
  }
  const username = req.body.username;
  const password = req.body.password;

  console.log(`[POST] ${req.headers.host} (${username}) -> AUTHENTICATE`);

  // easter egg
  if (username.toLowerCase() == "admin" && password.toLowerCase() == "admin") {
    return res.sendStatus(418);
  }

  // check if user exists
  const user = await User.findOne({ username: username });
  if (!user) {
    // return res.status(404).send("No user found");
    return res.sendStatus(401);
  }

  // test if password is correct
  try {
    if (await bcrypt.compare(password, user.password)) {
      const user = { username: username };

      // create and save new tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

      const newToken = new Token({
        _id: mongoose.Types.ObjectId(),
        refreshToken: refreshToken,
        updatedAt: new Date(),
      });
      newToken
        .save()
        .then(() => {
          console.log(`(${username}) -> RECEIVED ACCESSTOKEN`);

          // httpOnly cookie expires in 15 minutes and is not accessible by client
          res.cookie(
            "token",
            JSON.stringify({
              accessToken: accessToken,
              refreshToken: refreshToken,
            }),
            {
              maxAge: 15 * 60 * 1000,
              httpOnly: true,
            }
          );
          res.send();
        })
        .catch((err) => {
          throw err;
        });
    } else {
      // unauthorized (incorrect password)
      return res.sendStatus(401);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// GET add whitelisted player to database
router.get("/addwhitelistedplayer", async (req, res) => {
  const user = await User.findOne({ username: "WhitelistedPlayer" });
  if (!user) {
    try {
      const hashedPassword = await bcrypt.hash(
        process.env.WHITELISTED_PASSWORD,
        10
      );

      const guestUser = new User({
        _id: mongoose.Types.ObjectId(),
        username: "WhitelistedPlayer",
        password: hashedPassword,
      });

      guestUser
        .save()
        .then((newUser) => {
          res.status(201).send(newUser);
        })
        .catch((err) => {
          throw err;
        });
    } catch (err) {
      res.sendStatus(500);
    }
  } else {
    res.status(200).send("WhitelistedPlayer already added");
  }
});

module.exports = router;
