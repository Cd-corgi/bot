const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const ignored = require("../models/ignore-channel");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ignore-channels")
        .setDescription("let the bot skip the channels to don't execute commands there!")
        .addSubcommand(subCommand =>
            subCommand
                .setName("add-channel")
                .setDescription("add channels to the ignored list!")
                .addChannelOption(option =>
                    option
                        .setName("channel")
                        .setDescription("Mention the channel to add them to the list!")
                        .setRequired(true)
                )
        )
        .addSubcommand(subCommand =>
            subCommand
                .setName("list")
                .setDescription("Look what channels are ignored!")
        )
        .addSubcommand(subCommand =>
            subCommand
                .setName("remove-channel")
                .setDescription("remove the channels from the ignored list!")
                .addChannelOption(option =>
                    option
                        .setName("channel")
                        .setDescription("Mention the channel to remove from the list!")
                        .setRequired(false)
                )
        ),
    async run(client, interaction) {
        const choice = interaction.options.getSubcommand();
        const channel = interaction.options.getChannel("channel");
        const igg = await ignored.findOne({ guild: interaction.guild.id });

        if(choice === "add-channel") {
            if(igg.ignored.some(v => v.channel === channel.id)) return interaction.reply({
                content: "The mentioned channel is already ignored! please add other channel!",
                ephemeral: true
            })

            igg.ignored.push({ guild: chanel.id });

            await ignored.findOneAndUpdate({ guild: interaction.guild.id }, {ignored: igg.ignored});

            interaction.reply({
                content: `The channel have been ignored!`
            })
        } 
        if(choice === "list") {

        }
        if(choice === "remove-channel") {

        }
    }
}