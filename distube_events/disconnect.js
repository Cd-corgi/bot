const Discord = require('discord.js');

module.exports = (client, queue) => {
    let stoped = new Discord.MessageEmbed()
    .setTitle("⏹ | Stoped and i left the Voice Chat...")
    .setFooter("🐰 | Thanks for use Bunny Hops!")
    .setTimestamp()
    .setColor("WHITE")


    queue.textChannel.send({
        embeds: [stoped]
    })
}