const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const { token } = require('../public/config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("minigames")
        .setDescription("🎮 Play games in Voice Chat with friends!")
        .addSubcommand(subCommand =>
            subCommand
                .setName("youtube")
                .setDescription("Play a \"mini youtube\" on Discord!")
        )
        .addSubcommand(subCommand =>
            subCommand
                .setName("betrayal")
                .setDescription("Who\'s the betrayer? let\'s see!")
        )
        .addSubcommand(subCommand =>
            subCommand
                .setName("poker")
                .setDescription("♦ Let\'s see how your money gone from your wallet")
        )
        .addSubcommand(subCommand =>
            subCommand
                .setName("fishing")
                .setDescription("🐟 Catch that big fish to your lunch!")
        ),
    async run(client, interaction) {
        const chan = interaction.member.voice;
        let returnData = {
            code: 'none',
        }

        if (!chan) return interaction.reply({
            content: "You should be in a Voice Channel!"
        }).then(setTimeout(() => interaction.deleteReply(), 10000))

        const choice = interaction.options.getSubcommand();

        if (choice === "youtube") {
            
        } else if (choice === "betrayal") {

        } else if (choice === "poker") {

        } else if (choice === "fishing") {

        }
    }
}