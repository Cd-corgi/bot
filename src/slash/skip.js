const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skipping the current song to the next one!"),
    async run(client, interaction){
        const queue = client.distube.getQueue(interaction.member.voice.channel);
        if(!queue) return interaction.reply({content: 'Theres no music to skip or play!', ephemeral: true});

        if(!interaction.member.voice.channel) return interaction.reply({
            content: 'Please join in a Voice Channel',
            ephemeral: true
        })

        if(interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) {
            interaction.reply({
                content: `Please do this command in <#${interaction.guild.me.voice.channel.id}> !`,
                ephemeral: true
            })
        }

        if(!queue || queue.songs.length <= 1) {
            return interaction.reply("You can't skip, there are no tracks, please stop the player!");
        }
        
        client.distube.skip(interaction.member.voice.channel)
        interaction.reply({
            content: '⏩ | Skipping ...'
        }).then(setTimeout(() => interaction.deleteReply(), 5000))
    }
}