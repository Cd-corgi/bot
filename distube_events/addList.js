const Discord = require('discord.js');

module.exports = (client, queue, playlist) => {
    const playlists = new Discord.MessageEmbed()
    .setTitle("🔥 | A playlist have been added!")
    .setColor("GREEN")
    .addField(`Playlist name:`, `\`${playlist.name}\` - \`${playlist.songs.length} songs!\``, true)
    .addField(`Requested by:`, `${playlist.user}`, true)

    queue.textChannel.send({
        embeds: [playlists]
    }).then(m => setTimeout(() => m.delete(), 5000))
}