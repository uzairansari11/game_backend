const mongoose = require("mongoose");

const scoreSchema = mongoose.Schema({
  username: String,
  score:String
});

const ScoreModel = mongoose.model("score", scoreSchema);

module.exports = { ScoreModel };
