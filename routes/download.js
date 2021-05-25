const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/:fileName", async (req, res) => {
  const fileName = req.params.fileName;
  if (!fileName) return res.status(400).send("Downloading requires a filename");

  res.status(200).sendFile(path.join(__dirname, `../downloads/${fileName}`));
});

module.exports = router;
