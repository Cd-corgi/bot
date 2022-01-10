const mongoose = require("mongoose");

let nmass = new mongoose.Schema({
    guild: String,
    wmsg: String,
});

module.exports = mongoose.model("nomass", nmass, "Massive Messages")