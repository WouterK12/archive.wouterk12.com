const { generateAccessToken } = require("../../index");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const Token = require("../../models/Token");

// using the refreshToken, generate a new accessToken and give it to the client
// (when logged in, the client requests this every X minutes (5))
router.get("/", async (req, res) => {
  const refreshToken = req.tokens.refreshToken;
  if (refreshToken == null) return res.sendStatus(401);

  const token = await Token.findOne({ refreshToken: refreshToken });
  if (!token) return res.sendStatus(403);

  token.updatedAt = new Date();
  token.save();

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ username: user.username });

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
  });
});

// clean up old refresh tokens
// (remains of logged in clients that no longer have the httpOnly cookie (logged out))
async function CleanUpTokens() {
  const tokens = await Token.find();
  if (!tokens) return;

  let now = new Date();
  now.setMinutes(now.getMinutes() - 15);

  tokens.forEach((token) => {
    if (token.updatedAt < now) {
      token.delete();
    }
  });
}

CleanUpTokens();
setInterval(() => {
  CleanUpTokens();
}, 60 * 60 * 1000); // 1 hour

module.exports = router;
