const  Discord = require('discord.js');

module.exports = (client, queue) => {
    const fisi = new Discord.MessageEmbed()
    .setTitle("📤 | leaving Voice Channel. end of Queue!")
    .setColor("ORANGE")
    .setFooter("🐰 | Thanks for use Bunny Hops.inc")

    queue.textChannel.send({ embeds: [fisi] })
}