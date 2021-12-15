const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton } = require('discord.js');
const Discord = require('discord.js');
const paginationembed = require('discordjs-button-pagination')
const fs = require('fs')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("It show you some advices about the commands"),
    async run(client, interaction) {
        const General = new MessageEmbed()
            .setTitle(`Bunny Hops\' Help Menu!`)
            .setDescription(`The majority of the commands are built in \`/\` Commands!\n**They has several ways to use them!**\n > **Alterative functions!**\n>\`/\`warnings <add/check/remove>`)
            .setColor("YELLOW")

        const Mod = new MessageEmbed()
            .setTitle(`Bunny Hops\' Help Menu!`)
            .setDescription(client.slashCommands.map(z => `\`/${z.data.name}\``).join("\n"))
            .setColor("RANDOM")

        const button1 = new MessageButton()
                .setCustomId('previousbtn')
                .setLabel('Previous')
                .setStyle('DANGER');

        const button2 = new MessageButton()
                .setCustomId('nextbtn')
                .setLabel('Next')
                .setStyle('SUCCESS');

        let pages = [
            General,
            Mod
        ];

        let buttonList = [
            button1,
            button2
        ]

        paginationembed(interaction, pages, buttonList, tiemout)
    }
}