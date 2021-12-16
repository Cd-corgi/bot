const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const fs = require('fs')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("it shows you some advices about the commands"),
    async run(client, interaction){
        
    }
}