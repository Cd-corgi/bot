const Discord = require('discord.js');

module.exports = (client, queue) => {
    const alone = new Discord.MessageEmbed()
    .setTitle("🚪 | The party is over... no one there!")
    .setColor("DARK_RED")

    queue.textChannel.send({ embeds: [alone] })
}