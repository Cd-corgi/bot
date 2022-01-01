const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("np")
    .setDescription("let you show the current plying song!"),
    async run(client, interaction){
        const queue = client.distube.getQueue(interaction.member.voice.channel);

        if(!queue) return interaction.reply({
            content: "No songs playing roight now...",
            ephemeral: true
        })

        const npp = queue.songs[0];
        const uni = `${queue.songs[0].playing ? '⏸ |' : '🔴 |'}`;
        const part = Math.floor((queue.currentTime / queue.songs[0].duration) * 30);

        const np = new MessageEmbed()
        .setTitle("🔴 | Now Playing")
        .addField(`**📀 Song:**`, `\`${npp.name}\``, true)
        .addField(`**👤 Resquested by:**`, `${npp.user}`, true)
        .setDescription(`**▶ Progress:**\n\`${queue.formattedCurrentTime}\` ${'─'.repeat(part) + '🎶' + '─'.repeat(30 - part)} ${npp.formattedDuration}`)
        .setThumbnail(npp.thumbnail)

        interaction.reply({
            embeds: [np]
        })
    }
}