const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Control the Song's Volume")
    .addNumberOption(option =>
        option
        .setName("value")
        .setDescription("Define the volume of the song 0-100")
        .setRequired(true)
        ),
    async run(client, interaction){
        if(!interaction.member.voice.channel) return interaction.reply({
            content: 'You should be joined in a Voice Channel',
            ephemeral: true
        })

        if(interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply({
            content: "You should stay in the same Voice channel where i am joined!",
            ephemeral: true
        })

        const queue = client.distube.getQueue(interaction.member.voice.channel);

        if(!queue) return interaction.reply({content: 'No songs playing', ephemeral: true})

        const vv = interaction.options.getNumber('value');

        if(isNaN(vv)) {
            interaction.reply({
                content: 'Only numbers allowed!',
                ephemeral: true
            })
        }

        if(vv < '1') {
            interaction.reply({
                content: 'Please set your volume between 1 and 100!',
                ephemeral: true
            })
            return;
        }

        if(vv > '100') {
            interaction.reply({
                content: 'Please set your volume between 1 and 100!',
                ephemeral: true
            })
            return;
        }

        client.distube.setVolume(interaction, vv)
        interaction.reply({content: `The volume was setted up to \`${vv}\``}).then(setTimeout(() => interaction.deleteReply(), 5000))

        /*test*/


    }
}