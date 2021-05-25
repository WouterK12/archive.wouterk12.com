const express = require("express");
const router = express.Router();

const Token = require("../../models/Token");

router.delete("/", async (req, res) => {
  const refreshToken = req.tokens.refreshToken;
  if (refreshToken == null) return res.sendStatus(401);

  Token.deleteOne({ refreshToken: refreshToken })
    .then(() => {
      res.cookie("token", 0, { maxAge: 0 });
      res.sendStatus(204);
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});

module.exports = router;
