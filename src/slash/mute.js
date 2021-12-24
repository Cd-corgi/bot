const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mutes a user with time!")
    .addUserOption(option =>
        option
        .setName("user")
        .setDescription("Mention someone to mute!")
        .setRequired(true)
    )
    .addStringOption(option =>
        option
        .setName("length")
        .setDescription("Provide how long will last the mute!")
        .setRequired(true)
    )
    .addStringOption(option =>
        option
        .setName("reason")
        .setDescription("Provice the reason of the mute!")
        .setRequired(false)
    ),
    async run(client, interaction){ //a
        const user = interaction.options.getUser("user");
        const duration = interaction.options.getString("length");
        const Reason = interaction.options.getString("reason") || "Without Reason";

        const member = interaction.guild.members.cache.get(user.id);

        const timeoutMs = ms(duration);

        if(!timeoutMs) return interaction.reply("Specify a valid time!")

        member.timeout(timeoutMs, Reason)

        interaction.reply(`${user.user.username} have been muted!`)
    }
}