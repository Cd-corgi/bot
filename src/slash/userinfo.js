const Discord = require('discord.js')
const { ContextMenuCommandBuilder } = require('@discordjs/builders')
const { stripIndents } = require('common-tags')
module.exports = {
    data: new ContextMenuCommandBuilder()
    .setName("User Info")
    .setType(2),
    async run(client, interaction) {
        let user = await interaction.guild.members.fetch(interaction.targetId);

        var permission = interaction.member.permissions.has("MANAGE_CHANNELS")

        if(!permission) return interaction.reply({
            content: "\`You should have the MANAGE_CHANNELS permissions to do this command!\`",
            ephemeral: true
        })

        const uiembed = new Discord.MessageEmbed()
        .setTitle("👤 | User Info...")
        .setThumbnail(user.user.displayAvatarURL({ size: 1024, dynamic: true }))
        .setColor("BLUE")
        .addFields(
            {
                name: "🐰 | Account info",
                value: stripIndents`
                💬 **ID**: ${user.user.id}
                🤖 **BOT**: ${user.user.bot ? "Yes" : "No"}
                👶 **Created At**: <t:${Math.floor(user.user.createdTimestamp / 1000)}:d>
                `,
                inline: true
            },
            {
                name: "💳 | Member Info",
                value: stripIndents`
                🎫 **Nickname:**  ${user.nickname || 'No Nickname'}
                🎈 **Hoist Role:** ${user.roles.hoist ? user.roles.hoist.name : "None"}               
                `,
                inline: true
            },
            {
                name: `🏮 | Roles [${user.roles.cache.size - 1}]`,
                value: user.roles.cache.size ? user.roles.cache.map(roles => `**${roles}**`).slice(0, -1).join(" ") : "No Roles",
                inline: false
            }
        );

        interaction.reply({
            embeds: [uiembed],
            ephemeral: true
        })
    }
} 