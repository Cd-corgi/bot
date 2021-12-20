const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const wel = require('../models/welcome');
const mongoose = require('mongoose')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("welcome")
    .setDescription("Set a welcome channel!")
    .addSubcommand(subCommand =>
        subCommand
        .setName("set")
        .setDescription("Set a channel as welcome channel!")
        .addChannelOption(option =>
            option
            .setName("channel")
            .setDescription("Select a channel to set it as welcome inbox!")
            .setRequired(true)    
        )
        .addStringOption(option =>
            option
            .setName("message")
            .setDescription("Put your custom welcome message!")
            .setRequired(false)
        )
    )
    .addSubcommand(subCommand => 
        subCommand
        .setName("clear")
        .setDescription("Restore and disable the welcome function!")
    ),
    async run(client, interaction){
        
        const choice = interaction.options.getSubcommand();

        /*vars*/
        const chan = interaction.options.getChannel("channel");
        const txt = interaction.options.getString("message") || `{user}! Welcome to ${interaction.guild.name}`;

        if(choice === "set") {
            wel.findOne({ guildID: interaction.guild.id, channelID: chan.id }, async (err, data) => {
                if(err) throw err;
                if(!data) {
                    data = new wel({
                        guildID: interaction.guild.id,
                        channelID: chan.id,
                        welMessage: txt
                    })
                    data.save();
                    
                    const setted = new MessageEmbed()
                    .setTitle("Welcome system")
                    .setColor("GREEN")
                    .setDescription(`Your welcome channel is in ${chan} now!`)
                    
                    interaction.reply({
                        embeds: [setted]
                    }).then(setTimeout(() => interaction.deleteReply(), 5000))
                    return;
                } else {
                    wel.updateOne({channelID: chan.id, welMessage: txt})
                    return;
                }
            })


        } else if(choice === "clear") {
            wel.findOne({ guildID: interaction.guild.id }, async (err, data) => {
                if(err) throw err;
                if(!data) {
                    interaction.reply({
                        content: "This guild have not a welcome channel yet",
                        ephemeral: true
                    })
                    return;
                }
                
                await wel.deleteOne({ guildID: interaction.guild.id })
                    interaction.reply({
                        content: "Welcome message have been Disabled!",
                        ephemeral: true
                })
                
            }) //
        }
    }
}