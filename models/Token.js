const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  _id: Schema.Types.ObjectId,
  refreshToken: String,
  updatedAt: Date,
});

module.exports = mongoose.model("Token", tokenSchema, "tokens");
