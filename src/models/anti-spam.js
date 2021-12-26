const mongoose = require('mongoose');

let spam = new mongoose.Schema({
    guildID: String
});

module.exports = mongoose.model("anto-spam", spam, "anti-spam");