const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("search-song")
    .setDescription("Search and play a song in your Voice Chat"),
    async run(client, interaction){
        
    }
} //a