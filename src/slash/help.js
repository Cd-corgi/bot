const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("It show you some advices about the commands"),
    async run(client, interaction){
        
    }
}