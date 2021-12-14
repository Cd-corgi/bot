const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const moment = require('moment')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("It let you see about the server!"),
    async run(client, interaction){

        var permission = interaction.member.permissions.has("MANAGE_CHANNELS")

        if(!permission) return interaction.reply({
            content: "\`You should have the MANAGE_CHANNELS permissions to do this command!\`",
            ephemeral: true
        })
        
        var sec = {
            "LOW": "Low", "NONE": "None", "MEDIUM": "Medium", "HIGH": "High", "VERY_HIGH": "Very High"
        } 

        const serinfo = new MessageEmbed()
        .setTitle(`${interaction.guild.name}\'s Server Info`)
        .setColor("GREEN")
        .addField("ID", `${interaction.guild.id}`, true)
        .addField("Owner", `${await interaction.guild.fetchOwner()}`, true)
        .addField("Created at", `${moment.utc(interaction.guild.createdAt).format("YYYY[/]MMMM[/]d")} (${moment.utc(interaction.guild.createdAt).fromNow()})`, true)
        .setThumbnail(interaction.guild.iconURL())
        .addField("Roles", `${interaction.guild.roles.cache.size}`, true)
        .addField("Members", `${interaction.guild.memberCount}`, true)
        .addField("Security", `${sec[interaction.guild.verificationLevel]}`, true)
        interaction.reply({
            embeds: [serinfo],
            ephemeral: true
        })


    }
}