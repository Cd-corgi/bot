const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { ownerID } = require("../public/config.json")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("about")
    .setDescription("About the bot ..."),
    async run(client, interaction) {
        const infos = new MessageEmbed()
        .setTitle(`About the project!`)
        .addField(`**Created by:**`, `**<@${ownerID}>**`, true)
        .addField(`**Icon Created by:**`, `**<@790670577207345192>**`, true)
        .addField("_ _", "This is a little project of a Moderator Discord Bot, based in OtterBot's engine!\nWhere their main goal of this bot is control the users and moderate the suspicious URLS")
        .setFooter("0.0.1 | Alpha")

        interaction.reply({
            embeds: [infos],
            ephemeral: true
        })
    }
}