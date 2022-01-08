const Discord = require('discord');

module.exports = (query, message) => {
    message.channel.send(`No results for ${query}`)
}