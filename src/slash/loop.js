const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Let me repeat your favorite song, or the whole queue!")
    .addStringOption(option => 
        option
        .setName("action")
        .setDescription("Specify the type of loop of the playlist!")
        .addChoice("enable", "enable")
        .addChoice("disable", "disable")
        .setRequired(true)
    ),
    async run(client, interaction){

        const queue = client.distube.getQueue(interaction.member.voice.channel);

        if(!interaction.member.voice.channel)
        { 
            return interaction.reply({
            content: `Please join in the \`Voice Channel\` to execute this function!`,
            ephemeral: true
            }) 
        }  
        if(interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id)
        {
            interaction.reply({
                content: `My current Voice Channel is <#${interaction.guild.me.voice.channel.id}>, you should stay there to do the command!`,
                ephemeral: true
            })
        }

        const noqueue = new MessageEmbed()
        .setTitle("⚠ | There's no music in the queue..")
        .setColor("YELLOW")

        if(!queue) return interaction.reply({ embeds: [noqueue] })

        const option = interaction.options.getString("action")

        if(option === 'disable') {
            client.distube.setRepeatMode(interaction.member.voice.channel, 0)

            const dloop = new MessageEmbed()
            .setTitle("🔁 | The loop have been disabled!")
            .setColor("RED")

            interaction.reply({
                embeds: [dloop]
            })
            return;
        }
        if(option === 'enable') {
            client.distube.setRepeatMode(interaction.member.voice.channel, 2)

            const eloop = new MessageEmbed()
            .setTitle("🔁 | The loop have been enabled!")
            .setColor("NAVY")

            interaction.reply({
                embeds: [eloop]
            })
        }
        
    }
}