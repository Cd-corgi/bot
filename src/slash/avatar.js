const Discord = require("discord.js");
const { ContextMenuCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new ContextMenuCommandBuilder()
    .setName("Avatar")
    .setType(2),
    async run(client, interaction)  {
        let user = await interaction.guild.members.fetch(interaction.targetId);

        const embed = new Discord.MessageEmbed()
        .setTitle(`${user.user.tag}\'s avatar!`)
        .setImage(user.user.displayAvatarURL({ size: 2048, dynamic: true }))
        .setColor("RANDOM")

        interaction.reply({
            embeds: [embed],
            ephemeral: false
        })

    }
}