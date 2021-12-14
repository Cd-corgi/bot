const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kicks a mentioned user!")
    .addUserOption(option => 
        option
        .setName("user")
        .setDescription("Mention someone to kick")
        .setRequired(true)
        )
    .addStringOption(option =>
        option
        .setName("reason")
        .setDescription("Provide a reason to give a kick")
        .setRequired(false)
        ),
    async run(client, interaction){
        const target = interaction.options.getMember('user');

        const reason = interaction.options.getString('reason') || "\`UNKNOWN REASON\`";

        var perms = interaction.member.permissions.has("KICK_MEMBERS");
        var bperms = interaction.guild.me.permissions.has("KICK_MEMBERS");

        if(!perms) {
            interaction.reply({
                content: 'You can\'t use this command without "\`KICK_MEMBERS\`" permissions!',
                ephemeral: true
            })
            return;
        }

        if(!bperms) {
            interaction.reply({
                content: 'I have not the \`KICK_MEMBER\` permissions! Contant the mods/admins to provide me the permission!',
                ephemeral: true
            })
            return;
        }


        if(target.roles.highest.position >= interaction.member.roles.highest.position) {
            const error1 = new MessageEmbed()
            .setTitle(':x: | An error have been appeared!')
            .setDescription("I can't kick someone with a higher role than you.")
            .setColor("RED")

            interaction.reply({
                embeds: [error1],
                ephemeral: true
            })
            return;
        }

        try 
        {
            const suc = new MessageEmbed()
            .setTitle(`✔ | You have kicked someone...`)
            .addField("User Kicked", `<@${target.id}>`, true)
            .addField("Reason", `\`${reason}\``, true)
            interaction.reply({
                embeds: [suc]
            })
            target.kick(reason);
            target.send(`You have been kicked from **${interaction.guild.name}**\n> REASON: ${reason}`)
        } catch(e) 
        {
            interaction.reply({
                content: `An error just happened! ${e}\n**POSSIBLE REASONS**\n> May you kivked a bot who doesn't accept DMS\n> API issues, contact the Bot owner`,
                ephemeral: true
            }) 
        }
        
    }
}