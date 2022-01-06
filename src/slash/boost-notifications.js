const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const boost = require('../models/boost');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("boost-notification")
        .setDescription("Let the bot sends Boost Notification from your server!")
        .addSubcommand(subCommand =>
            subCommand
                .setName("clear")
                .setDescription("Disable the boosting notification!")
        )
        .addSubcommand(subCommand =>
            subCommand
                .setName("set")
                .setDescription("Set your boost Notification!")
                .addChannelOption(option =>
                    option
                        .setName("channel")
                        .setDescription("Provide the channel where the notification can be sent!")
                        .setRequired(true)
                )
        ),
    async run(client, interaction) {
        await interaction.reply("Working ...")
        const choice = interaction.options.getSubcommand();
        const channel = interaction.options.getChannel("channel");
        const bg = await boost.findOne({ guild: interaction.guild.id })

        if (choice === "set") {
            if (!bg) {
                if (channel.type !== "GUILD_TEXT" && channel.type !== "GUILD_NEWS") return interaction.editReply({
                    content: `An invalid channel was provided!`
                })

                new boost({
                    guild: interaction.guild.id,
                    channel: channel.id
                }).save();
                interaction.editReply({
                    content: `The Channel ${channel} is the Boosting channel now!`
                }).then(() => setTimeout(() => interaction.deleteReply(), 7500))
            } else {
                await boost.findOneAndUpdate({ guild: interaction.guild.id }, { channel: channel.id })

                interaction.editReply({
                    content: `The Boosting channel is ${channel} now!`
                }).then(() => setTimeout(() => interaction.deleteReply(), 7500))
            }
        }
        if (choice === "clear") {
            if(!bg) return interaction.editReply({content: "This server have not a boost channel yet! Set one!", ephemeral: true})
            
            await boost.findOneAndDelete({ guild: interaction.guild.id }, { guild: interaction.guild.id })
            
            interaction.editReply({
                content: `The Boosting Notification is Disabled!`
            }).then(() => setTimeout(() => interaction.deleteReply(), 7500))            
        }

    }
}