const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const parseTime = require('parse-duration');
const prettyMs = require('pretty-ms');
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
        const Reason = interaction.options.getString("reason") || "Without Reason";

        var bperms =  interaction.guild.me.permissions.has("MANAGE_CHANNELS")
        var perms =  interaction.member.permissions.has("MANAGE_CHANNELS")

        if(!perms) {
            interaction.reply({
                content: 'You can\'t use this command without "\`MANAGE_CHANNELS\`" permissions!',
                ephemeral: true
            })
            return;
        }

        if(!bperms) {
            interaction.reply({
                content: 'I have not the \`MANAGE_CHANNELS\` permissions! Contant the mods/admins to provide me the permission!',
                ephemeral: true
            })
            return;
        }


        const member = interaction.guild.members.cache.get(user.id);


        const duration = interaction.options.getString("length");

        if(!duration) return interaction.reply({
            content: 'Specify the time!',
            ephemeral: true
        })

        let parsedTime = parseTime(duration);

        if(parsedTime < ms("1m") || parsedTime > ms("28d")) {
            return interaction.reply({
                content: 'The provided duration is out of my range!',
                ephemeral: true
            })
        }

        await member.timeout(parsedTime, Reason)

        interaction.reply(`<@${user.id}> Has been Muted for about **${prettyMs(parsedTime, {verbose: true})}**`)
    }
}