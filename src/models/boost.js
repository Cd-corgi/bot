const mongoose = require('mongoose');

let boosted = new mongoose.Schema({
    guild: String,
    channel: String
});

module.exports = mongoose.model('boost', boosted, 'Boost Notify');