const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const nmass = require('../models/anti-mass')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("anti-mass")
        .setDescription("Enable the sytem that it controls the massive messages!")
        .addSubcommand(subCommand =>
            subCommand
                .setName("set")
                .setDescription("Manage the system to toogle on or off!")
                .addStringOption(option =>
                    option
                        .setName("enabling")
                        .setDescription("toogle the system on and off!")
                        .addChoice("On", "on")
                        .addChoice("Off", "off")
                        .setRequired(true)
                )
                .addNumberOption(option =>
                    option
                        .setName("detection")
                        .setDescription("set what numbers of characters you want the bot detects")
                        .setRequired(false)
                )
        ),
    async run(client, interaction) {
        const choice = interaction.options.getSubcommand();
        const enna = interaction.options.getString("enabling");
        const num = interaction.options.getNumber("detection") || 450;

        var perms = interaction.member.permissions.has("MANAGE_MESSAGES");
        var bperms = interaction.guild.me.permissions.has("MANAGE_MESSAGES");

        if(!perms) {
            interaction.reply({
                content: 'You can\'t use this command without "\`MANAGE_MESSAGES\`" permissions!',
                ephemeral: true
            })
            return;
        }

        if(!bperms) {
            interaction.reply({
                content: 'I have not the \`MANAGE_MESSAGES\` permissions! Contant the mods/admins to provide me the permission!',
                ephemeral: true
            })
            return;
        }


        if (choice === "set") {
            let nmasss = nmass.findOne({ guild: interaction.guild.id });
            if (enna === "on") {
                if (!nmasss) {
                    new nmass({
                        guild: interaction.guild.id,
                        wmsg: num
                    }).save();

                    const enabled = new MessageEmbed()
                        .setDescription("The Anti-Mass have been `Enabled`")
                        .setColor("GREEN")

                    return interaction.reply({
                        embeds: [enabled]
                    })
                } else {
                    const alr1 = new MessageEmbed()
                        .setDescription("The Anti-Mass is already `Enabled`")
                        .setColor("YELLOW")

                    return interaction.reply({
                        embeds: [enabled]
                    })
                }
            } else
                if (enna === "off") {
                    if (nmasss) {
                        await nmass.findOneAndDelete({ guild: interaction.guild.id }, { guild: interaction.guild.id });

                        const disabled = new MessageEmbed()
                            .setDescription("The Anti-Mass have been `Disabled`")
                            .setColor("RED")

                        return interaction.reply({
                            embeds: [disabled]
                        })
                    } else {
                        const alr2 = new MessageEmbed()
                            .setDescription("The Anti-Mass is already `Disabled`")
                            .setColor("YELLOW")

                        return interaction.reply({
                            embeds: [alr2]
                        })
                    }
                }
        }
    }
}