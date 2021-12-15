const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("It show you some advices about the commands"),
    async run(client, interaction){
        const General = new MessageEmbed()
        .setTitle(`${interaction.guild.me.unsername}\'s Help Menu!`)
        .setDescription(`The majority of the commands are built in \`/\` Commands!\n**They has several ways to use them!**\n> **Alterative functions!**\n>\`/\`warnings <add/check/remove>`)
        .setColor("YELLOW")

        interaction.reply({
            embeds: [General]
        })
    }
}