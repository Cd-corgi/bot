const Discord = require('discord.js')

module.exports = (client, queue, song) => {
    const ss = new Discord.MessageEmbed()
    .setTitle("💽 | A new song have been added")
    .setColor("GREEN")
    .addField(`Song name:`, `\`${song.name}\``, true)
    .addField(`Duration:`, `\`${song.formattedDuration}\``, true)
    .addField(`Requested by:`, `${song.user}`)
    .setFooter(`🔇 | i got deafened to make the voice channel be a safe zone!`)
    queue.textChannel.send({
        embeds: [ss]
    }).then(m => setTimeout(() => m.delete(), 10000))
} //a