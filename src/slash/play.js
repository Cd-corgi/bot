const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("lemme play a song in Voice Chat!")
    .addStringOption(option => 
        option
        .setName("query")
        .setDescription("Write your song title!")
        .setRequired(true)
    ),
    async run(client, interaction){

        const song = interaction.options.getString("query")

        if(!interaction.member.voice.channel) return interaction.reply({
            content: "You should be joined in a Voice Chat before!",
            ephemeral: true
        });

        if(interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply({
            content: "You should stay in the same Voice channel where i am joined!",
            ephemeral: true
        })

        /*interaction.client.distube.playVoiceChannel(
            interaction.member.voice.channel,
            song,
            {
                textChannel: interaction.channel,
                member: interaction.member
            }
        )*/

        interaction.client.distube.play(interaction.member, song)

        interaction.reply({
            content: "🔍 | Fetching the song ...",
            ephemeral: false
        }).then(setTimeout(() => interaction.deleteReply(), 5000))
        
    }
}