const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("It stops and leave the Voice Channel"),
    async run(client, interaction){
        if(!interaction.member.voice.channel) return interaction.reply({
            content: "⚠ | You should be joined in a Voice Channel",
            ephemeral: true
        })

        if(interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) {
            interaction.reply({
                content: `Please do this command in <#${interaction.guild.me.voice.channel.id}> !`,
                ephemeral: true
            })
        }

        interaction.client.distube.stop(interaction);
        interaction.reply({
            content: "stopping ..."
        }).then(setTimeout(() => interaction.deleteReply(), 300))
    }

}