const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const mongoose = require('mongoose')
const Schema = require('../models/warningDB')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("warnings")
    .setDescription("Give the user a Strike, 3 strikes = kick!")
    .addSubcommand(subCommand =>
        subCommand
        .setName("add")
        .setDescription("Warn a user with their reason!")
        .addUserOption(option =>
            option
            .setName("user")
            .setDescription("Select a user!")
            .setRequired(true)
        )
        .addStringOption(option =>
            option
            .setName("reason")
            .setDescription("Provide the warn\'s reason!")
            .setRequired(false)
        )
    )
    .addSubcommand(subCommand =>
        subCommand
        .setName("check")
        .setDescription("checks the user\'s warns!")
        .addUserOption(option =>
            option
            .setName("user")
            .setDescription("Checks the user\'s warns")
            .setRequired(true)
        )
    )
    .addSubcommand(subCommand =>
        subCommand
        .setName("remove")
        .setDescription("Clear the selected warn!")
        .addUserOption(option =>
            option
            .setName("user")
            .setDescription("Select the user to remove a warn!")
            .setRequired(true)
        )
        .addIntegerOption(option => 
            option
            .setName("id")
            .setDescription("select by existing id!")
            .setRequired(false)
        )
    ),
    async run(client, interaction){

        var perms = interaction.member.permissions.has("MANAGE_MESSAGES");

        if(!perms) return interaction.reply({
            content: "You can\'t warn pleople without the \`MANAGE_MESSAGES\` permission!",
            ephemeral: true
        })
        
        const choice = interaction.options.getSubcommand();
        const member = interaction.options.getMember("user");
        const reason = interaction.options.getString("reason") || "No reason provided";
        const wid = interaction.options.getNumber("id");
        const wdate = new Date(interaction.createdTimestamp).toLocaleDateString();

        if(choice === "add") {
            Schema.findOne({ guildID: interaction.guild.id, userID: member.id }, async (err, data) => {
                if(err) throw err;
                if(!data) {
                    data = new Schema({
                        guildID: interaction.guild.id,
                        userID: member.id,
                        Content: [
                            {
                                ExecuterID: interaction.user.id,
                                Reason: reason,
                                Date: wdate 
                            }
                        ]
                    })
                } else {
                    const obj = {
                        ExecuterID: interaction.user.id,
                        Reason: reason,
                        Date: wdate
                    }
                    data.Content.push(obj);
                }
                data.save()

                if(data.Content >= 3) {
                    member.kick("3 warnings limit have been broken!")
                    interaction.reply({
                        content: `${member.user.username} have been kicked due \`3 warns\``
                    }).then(setTimeout(() => interaction.deleteReply(), 10000))
                }
            });

            const reported = new MessageEmbed()
            .setTitle(`A user have been warned!`)
            .addField("User Warned", `${member} | ${member.id}`)
            .addField("Reason", `${reason}`)
            .addField("Report Author", `<@${interaction.user.id}>`)

            interaction.reply({
                embeds: [reported] 
            })
        } else if(choice === "check") { 

            Schema.findOne({ guildID:interaction.guild.id, userID: member.id }, async(err, data) => {
                if(err) throw err;
                if(data) {
                    const wlist = new MessageEmbed()
                    .setTitle(`${member.user.username}\'s Warnings!`)
                    .setColor("RED")
                    .setDescription(`${data.Content.map( //aaa
                        (w, i) => `**ID** ${i + 1}\n**By** <@${w.ExecuterID}>\n**Date** \`${w.Date}\`\n**Reason** \`${w.Reason}\`\n`
                    ).join(" ")}`)
                    interaction.reply({
                        embeds: [wlist]
                    })
                } else {
                    const nowr = new MessageEmbed()
                    .setTitle(`${member.user.username}\'s warnings`)
                    .setDescription("No warnings detected!")
                    interaction.reply({
                        embeds: [nowr],
                        ephemeral: true
                    })
                }
            })

        } else if(choice === "remove") {
            Schema.findOne({ guildID: interaction.guild.id, userID: member.id }, async (err, data) => {
                if(err) throw err;
                if(data) {
                    data.Content.splice(wid, 1)
                        interaction.reply({
                            content: `<@${data.userID}>\'s id: ${wid + 1} have been removed!`
                        })
                    data.save()   
                } else {
                    const nowr = new MessageEmbed()
                    .setTitle(`${member.user.username}\'s warnings`)
                    .setDescription("No warnings detected!")
                    interaction.reply({
                        embeds: [nowr],
                        ephemeral: true
                    })
                }
            })
        }
    }
}