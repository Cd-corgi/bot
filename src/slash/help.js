const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const fs = require('fs')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("it shows yuosome advices about the commands"),
    async run(client, interaction){
        var cmds = [];

        let scmd = fs.readdirSync('../slash').filter(file => file.endsWith('.js'));

        for(const file of scmd) {
            
            let com = require(`../slash/${file}`);
            cmds.push(com.toString());
            console.log(cmds.join("\n"))
        }

        
    }
}