const mongoose = require('mongoose')

let ic = new mongoose.Schema({
    guild: String,
    ignored: [{
        channel: String
    }]  
});

module.exports = mongoose.model("ignored", ic, "ignored channels");