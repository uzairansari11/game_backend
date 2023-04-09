const mongoose = require("mongoose")

const connection = mongoose.connect("mongodb+srv://uzair:uzair@cluster0.n1eo2id.mongodb.net/game?retryWrites=true&w=majority")


module.exports = { connection }