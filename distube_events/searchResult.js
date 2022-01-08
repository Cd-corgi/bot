const { MessageEmbed, Client, Message} = require('discord.js');

module.exports = (message, results) => {
    try {
        let query = new MessageEmbed()
        .setDescription(results.map((song, i) => `**${i + 1}** - ${song.name} | \`${song.formattedDuration}\``).join("\n"))
        .setFooter(`You have around 30 seconds to choose!`)
        message.channel.send({
            content: "🔎 **Choose one of the results!**",
            embeds: [query]
        })
    } catch (error) {
        console.log(error);
    }
}