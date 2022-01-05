const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Discord = require('discord.js');
const self_roles = require('../models/self-roles');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("self-roles")
        .setDescription("manage the roles choosing in your server!")
        .addSubcommand(subCommand =>
            subCommand
            .setName("create")
            .setDescription("Create a new Role Menu!")
            .addStringOption(option =>
                option
                .setName("name")
                .setDescription("Provide the name of the Role Menu!")
                .setRequired(true)
            )
        )
        .addSubcommand(subCommand =>
            subCommand
            .setName("delete")
            .setDescription("Delete a Role Menu!")
            .addStringOption(option =>
                option
                .setName("name")
                .setDescription("Provide the name of an existing Role Menu!")
                .setRequired(true)
            )
        )
        .addSubcommand(subCommand =>
            subCommand
            .setName("start")
            .setDescription("Start a Role Menu!")
            .addStringOption(option =>
                option
                .setName("name")
                .setDescription("Provide the name of an existing Role Menu!")
                .setRequired(true)
            )
            .addChannelOption(option =>
                option
                .setName("channel")
                .setDescription("Mention the channel to send the Role Menu!")
                .setRequired(true)
            )
        )
        .addSubcommand(subCommand =>
            subCommand
            .setName("add-role")
            .setDescription("Add the Role to a Role Menu!")
            .addStringOption(option =>
                option
                .setName("name")
                .setDescription("Provide the name of an existing Role Menu!")
                .setRequired(true)
            )
            .addRoleOption(option =>
                option
                .setName("role")
                .setDescription("Provide the role to add!")
                .setRequired(true)
            )
        )
        .addSubcommand(subCommand =>
            subCommand
            .setName("remove-role")
            .setDescription("remove the Role from of one Role Menu!")
            .addStringOption(option =>
                option
                .setName("name")
                .setDescription("Provide the name of an existing Role Menu!")
                .setRequired(true)
            )
            .addRoleOption(option =>
                option
                .setName("role")
                .setDescription("Provide the role to remove!")
                .setRequired(true)
            )
        )
    ,
    async run(client, interaction) {

        await interaction.reply(`${client.user.username} is working ...`)

        const choice = interaction.options.getSubcommand();
        const name = interaction.options.getString("name");
        const emoji = interaction.options.getString("emoji");
        const menu = await self_roles.findOne({ name, guild: interaction.guild.id });
        const my_role = interaction.guild.me.roles.highest.position;
        const rr = interaction.options.getRole("role");
        const channel = interaction.options.getChannel("channel");

        if(choice === "create") {
            if(menu) return interaction.editReply({ content: `Reaction Role menu is already existing! Use other different one!` })

            await new self_roles({
                guild: interaction.guild.id,
                name,
                msg: "0",
            }).save();

            interaction.editReply({ content: `The Role menu with the name \`${name}\` have been created!` })
        } else
        if(choice === "delete") {
            if(!menu) return interaction.editReply({ content: `The Reaction Role does not exist! Use an existing one!` })

            await self_roles.findOneAndDelete({
                guild: interaction.guild.id,
                name,
            })

            interaction.editReply({ content: `The role with the name \`${name}\` have been removed!` })
        } else 
        if(choice === "start") {
            if(channel.type !== "GUILD_TEXT" && channel.type !== "GUILD_NEWS") return interaction.editReply({
                content: `An invalid channel was provided!`
            })

            if(menu.roles.length === 0) return interaction.editReply({
                content: 'This menu have no roles!'
            })

            let content = `Reaction Roles: \`${menu.name}\` \nReact here to get your roles!`,
            rows = [new MessageActionRow()], index;

            menu.roles.forEach((v, i) => {
                content += `>${interaction.guild.emojis.cache.get(v.emoji)?.toString() || v.emoji} : \`${interaction.guild.roles.cache.get(v.role).name}\`\n\n`
            
                index = parseInt(i / 5);
                const button = new MessageButton({
                    customId: `reaction_role_${i}`,
                    style: "PRIMARY",
                    emoji: v.emoji,
                });
            
                rows[index] ? rows[index].addComponents(button) : rows[index] = new MessageActionRow().addComponents(button)

            })

            const msg = await channel.send({ content, components: rows })

            await self_roles.findOneAndUpdate({ name, guild: interaction.guild.id }, {msg: msg.id})

            interaction.editReply({ content: "The menu have been started!" })
        }
    }
}