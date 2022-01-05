const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const rr = require('../models/self-roles') ;

module.exports = {
    data: new SlashCommandBuilder()
    .setName("self-roles")
    .setDescription("manage the roles choosing in your server!")
    .addSubcommand(subCommand =>   /* Addrole */
        subCommand
        .setName("add-role")
        .setDescription("Add more roles to get choosen!")
        .addRoleOption(option =>
            option
            .setName("role")
            .setDescription("Choose a role that you want to add")
            .setRequired(true)
        )
        .addStringOption(option =>
            option
            .setName("description")
            .setDescription("Provide the description of the role!")
            .setRequired(false)
        )
        .addStringOption(option =>
            option
            .setName("emoji")
            .setDescription("Give the role an emoji!")
            .setRequired(false)
        )
    )
    ,
    async run(client, interaction){
        
        const choice = interaction.options.getSubcommand();
        const rl = interaction.options.getRole("role");
        const rldesc = interaction.options.getString("description") || null;
        const emoji = interaction.options.getString("emoji") || null;

        if(choice === "add-role") {
            if(rl.position >= interaction.guild.me.roles.highest.position) {
                interaction.reply({
                    content: 'I can\'t add this Role because it is higher or equals than me!',
                    ephemeral: true
                })
                return;
            }

            const guildDAta = rr.findOne({ guildID: interaction.guild.id });

            const newRole = {
                roleID: rl.id,
                rldesc,
                emoji,
            }

            if(guildDAta) {
                const roleData = guildDAta.roles.find((x) => x.roleID === rl.id)

                if(roleData) {
                    roleDAta = newRole;
                } else {
                    guildDAta.roles = [...guildDAta.Roles, newRole] 
                }

                await guildDAta.save();
            } else {
                new rr({
                    guildID: interaction.guild.id,
                    Roles: newRole,
                }).save()

                interaction.reply(`New Role added ${rl.name}`)
            } 
        }

    }
} //a