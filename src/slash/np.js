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

        const np = new MessageEmbed()
        .setDescription(`Now Playing: \`${npp.name}\`\nDuration: \`${npp.formattedDuration}\`\nRequested by: ${npp.user}`)
        .setThumbnail(npp.thumbnail)

        interaction.reply({
            embeds: [np]
        })
    }
}