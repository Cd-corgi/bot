const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const { token } = require('../public/config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("minigames")
        .setDescription("🎮 Play and Enjoy activities in Voice Chat with friends!")
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
        
        if (!chan) return interaction.reply({
            content: "You should be in a Voice Channel!"
        }).then(setTimeout(() => interaction.deleteReply(), 10000))

        const choice = interaction.options.getSubcommand();

        if (choice === "youtube") {
            client.discordTogether.createTogetherCode(interaction.member.voice.channel.id, 'youtube').then(async invite => {
                const ytmbed = new MessageEmbed()
                .setTitle("YouTube Together")
                .setThumbnail("https://media.giphy.com/media/13Nc3xlO1kGg3S/giphy.gif")
                .setDescription(`Enjoy and Share moments with your friends!\n${invite.code}`)
                
                return interaction.reply({
                    embeds: [ytmbed]
                })
            })
        } else if (choice === "betrayal") {
            client.discordTogether.createTogetherCode(interaction.member.voice.channel.id, 'betrayal').then(async invite => {
                const bet = new MessageEmbed()
                .setTitle("Betrayal")
                .setThumbnail("https://media.giphy.com/media/o3OudM1EkO9SiAzo9V/giphy.gif")
                .setDescription(`Play as a normal member or a betrayer!\n${invite.code}`)

                return interaction.reply({
                    embeds: [bet]
                })
            })
        } else if (choice === "poker") {

        } else if (choice === "fishing") {

        }
    }
} //a