const Discord = require('discord.js')

module.exports = (client, queue, song) => {

    let phrases = [
        "shh ~ the song is already playing",
        "Now Playing...",
        "Hunt the beat",
        "The bunny DJ already played the music"
    ]

    let inde = Math.floor(Math.random() * (phrases.length - 1) + 1);

    const npp = new Discord.MessageEmbed()
    .setTitle(`▶ | ${phrases[inde]}`)
    .addField("💽 **__Song name__**", `\`${song.name}\``)
    .addField("⏱ **__Duration__**", `\`${song.formattedDuration}\``, true)
    .addField("🐰 **__Added by__**", `${song.user}`, true)
    .setThumbnail("https://media.giphy.com/media/Lhn18jZlqRaTq9pmZt/giphy.gif")
    .setImage(song.thumbnail)
    queue.textChannel.send({
        embeds: [npp]
    })
}