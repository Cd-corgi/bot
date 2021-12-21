const mongoose = require('mongoose');

let sche = new mongoose.Schema({
    userID: String,
    guildID: String,
    moderatorID: String,
    reason: String,
    timestamp: String
})

module.exports = new mongoose.model("warns", sche, "Warnings");