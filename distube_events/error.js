const Discord = require('discord.js');

module.exports = (textChannel, e) => {
    textChannel.send(`:x: | ${e}`)
    console.log(e)
}