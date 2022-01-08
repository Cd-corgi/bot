const Discord = require('discord.js');

module.exports = (query, message) => {
    message.channel.send(`No results for ${query}`)
}