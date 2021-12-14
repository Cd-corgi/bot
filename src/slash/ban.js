const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban the mentioned user!")
    .addUserOption(option =>
        option
        .setName('user')
        .setDescription("Mention someone to ban")
        .setRequired(true)
        )
    .addStringOption(option => 
        option
        .setName("reason")
        .setDescription("Provide a reason to give a ban")
        .setRequired(false)
        ),
    async run(client, interaction){
        const target = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || "\`UNKNOWN REASON\`";
        /* hello */
        var perms = interaction.member.permissions.has("BAN_MEMBERS");
        var bperms = interaction.guild.me.permissions.has("BAN_MEMBERS");

        if(!perms) {
            interaction.reply({
                content: 'You can\'t use this command without "\`BAN_MEMBERS\`" permissions!',
                ephemeral: true
            })
            return;
        }

        if(!bperms) {
            interaction.reply({
                content: 'I have not the \`BAN_MEMBERS\` permissions! Contant the mods/admins to provide me the permission!',
                ephemeral: true
            })
            return;
        }


        if(target.roles.highest.position >= interaction.member.roles.highest.position) {
            const error1 = new MessageEmbed()
            .setTitle(':x: | An error have been appeared!')
            .setDescription("I can't ban someone with a higher role than you.")
            .setColor("RED")

            interaction.reply({
                embeds: [error1],
                ephemeral: true
            })
            return;
        }

        try {
            const banned = new MessageEmbed()
            .setTitle("✅ | You banned someone ...")
            .addField("User Banned", `<@${target.id}>`, true)
            .addField("Reason", `\`${reason}\``, true)
            .setColor("GREEN")

            interaction.reply({
                embeds: [banned]
            })
            target.ban(reason);
            target.send(`You have been banned from ${interaction.guild.name}\n> ${reason}`);
        } catch (error) {
            interaction.reply({
                content: `:x: 1 An error just appeared! ${error}`,
                ephemeral: true
            })
        }
    }
}