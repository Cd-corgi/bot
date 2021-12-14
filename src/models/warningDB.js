const mongoose = require('mongoose')

let ss = new mongoose.Schema({
    guildID: String,
    userID: String,
    Content: Array
});

module.exports = mongoose.model('Warning', ss, 'warnings') /*a */