const { SlashCommandBuilder } = require('@discordjs/builders');
const WSchema = require('../models/warns')
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const moment = require('moment')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("warnings")
    .setDescription("Like the baseball, 3 strikes. Out!")
    .addSubcommand(subCommand =>
        subCommand
        .setName("add")
        .setDescription("Apply a warn to someone!")
        .addUserOption(option =>
            option
            .setName("target")
            .setDescription("Tag someone to apply a warn!")
            .setRequired(true)
        )
        .addStringOption(option =>
            option
            .setName("reason")
            .setDescription("provide a reason of the warn!")
            .setRequired(false)
        )
    )
    .addSubcommand(subCommand => 
        subCommand
        .setName("list")
        .setDescription("Check the user\'s warnings")
        .addUserOption(option =>
            option
            .setName("target")
            .setDescription("Tag someone to apply a warn!")
            .setRequired(true)
        )
    )
    .addSubcommand(subCommand =>
        subCommand
        .setName("remove")
        .setDescription("Remove one of the warns of the user")
        .addUserOption(option =>
            option
            .setName("target")
            .setDescription("Tag someone to apply a warn!")
            .setRequired(true)
        )
        .addIntegerOption(option =>
            option
            .setName("id")
            .setDescription("insert the existing warn to remove!")
            .setRequired(true)
        )
    ),
    async run(client, interaction){
        const choice = interaction.options.getSubcommand();
        const user = interaction.options.getUser("target");
        const Reason = interaction.options.getString("reason") || "UNKNOWN REASON";

        if(choice === "add") {
            new WSchema({
                userID: user.id,
                guildID: interaction.guild.id,
                reason: Reason,
                moderadorID: interaction.user.id,
                timestamp: Date.now(),
            }).save();

            const warembed = new MessageEmbed()
            .setTitle(`${user.username} have been warned!`)
            .setDescription(`Reason: \`${Reason}\`\nModerator: <@${interaction.user.id}>`)

            interaction.reply({
                embeds: [warembed]
            }) //a

        } else if(choice === "list") {

        } else if(choice === "remove") {

        }
    }
}