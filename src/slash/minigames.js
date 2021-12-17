const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const fetch = require('node-fetch');
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

        if (!chan) return interaction.reply({
            content: "You should be in a Voice Channel!"
        }).then(setTimeout(() => interaction.deleteReply(), 10000))

        const choice = interaction.options.getSubcommand();

        if (choice === "youtube") {
            fetch(`https://discord.com/api/v8/channels/${chan.id}/invites`, {
                method: "POST",
                body: JSON.stringify({
                    max_age: 86400,
                    max__uses: 0,
                    target_application_id: "755600276941176913",
                    target_type: 2,
                    temporary: false,
                    validate: null
                }),
                headers: {
                    "Authorization": `Bot ${token}`,
                    "Content-Type": "application/json"
                }
            }).then(res => res.json())
            .then(invite => {
                if(!invite.code) return interaction.reply({
                    content: ':x: I cannot start the application!'
                })

                const ytmbed = new MessageEmbed()
                .setTitle("YouTube Together")
                .setThumbnail("https://media.giphy.com/media/13Nc3xlO1kGg3S/giphy.gif")
                .setDescription(`Press the Link to join\n\n[> Click here <](https://discord.com/invite/${invite.code})`)

                interaction.reply({
                    embeds: [ytmbed]
                })

            })
        } else if (choice === "betrayal") {

        } else if (choice === "poker") {

        } else if (choice === "fishing") {

        }
    }
}