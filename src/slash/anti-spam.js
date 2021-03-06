const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const NoSpam = require('../models/anti-spam');
const mongoose = require('mongoose')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("anti-spam")
    .setDescription("Activate the function of control the message Spamming")
    .addStringOption(option =>
        option
        .setName("status")
        .setDescription("Provide if you want to enabled or disable this system.")
        .addChoice("Enable", "on")
        .addChoice("Disable", "off")
        .setRequired(true)
    ),
    async run(client, interaction){

        const state = interaction.options.getString("status")

        var perms = interaction.member.permissions.has("MODERATE_MEMBERS");
        var bperms = interaction.guild.me.permissions.has("MODERATE_MEMBERS");

        if(!perms) {
            interaction.reply({
                content: 'You can\'t use this command without "\`MODERATE_MEMBERS\`" permissions!',
                ephemeral: true
            })
            return;
        }

        if(!bperms) {
            interaction.reply({
                content: 'I have not the \`MODERATE_MEMBERS\` permissions! Contant the mods/admins to provide me the permission!',
                ephemeral: true
            })
            return;
        }

        if(state === "on") {
            
            NoSpam.findOne({ guildID: interaction.guild.id }, async(err, data) => {
                if(err) throw err;
                if(data) {
                    interaction.reply({
                        content: "`This function is already Enabled`",
                        ephemeral: true
                    })
                    return;
                } else {
                    data = new NoSpam({
                        guildID: interaction.guild.id
                    }).save();

                    const enn = new MessageEmbed()
                    .setTitle("✅ Anti-Spam Enabled!")
                    .setColor("GREEN")

                    interaction.reply({
                        embeds: [enn]
                    }).then(() => setTimeout(() => interaction.deleteReply(), 15000))
                }
            })

        } else if(state === "off") {
           NoSpam.findOne({ guildID: interaction.guild.id }, async(err, data) => {
               if(err) throw err;
               if(!data) {
                interaction.reply({
                    content: "`This function is already Disabled`",
                    ephemeral: true
                })
                return;
               } else {
                   await NoSpam.deleteOne({ guildID: interaction.guild.id })
                   const des = new MessageEmbed()
                   .setTitle("✅ Anti-Spam Disabled!")
                   .setColor("RED")
                   interaction.reply({
                       embeds: [des]
                   })
               }
           })
        }
    }
}