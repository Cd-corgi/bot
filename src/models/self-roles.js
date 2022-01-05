const mongoose = require('mongoose')

let rr = new mongoose.Schema({
    guildID: String,
    Roles: Array,
});

module.exports = mongoose.model('reaction', rr, 'Reaction Roles');