const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("instagram")
    .setDescription("Search your or someone else\'s instagram")
    .addStringOption(option =>
        option
        .setName("username")
        .setDescription("Put the name of a user of instagram!")
        .setRequired(true)
    ),
    async run(client, interaction){
        const text = interaction.options.getString('username');

        fetch(`https://api.popcat.xyz/instagram?user=${text}`).then(response => response.json()).then(data => {
        const ig = new MessageEmbed()
        .setTitle("📷 | Instagram Profile")
        .setColor("#3f729b")
        .setThumbnail(data.profile_pic)
        .addField("👤 User Name", `${data.username}`, true)
        .addField("💬 Biography", `${data.biography}`)
        .addField("💖 Followers", `${data.followers}`, true)
        .addField("📷 Posts", `${data.posts}`, true)
        .addField("✅ Verified", `${data.verified}`, true)
        

        interaction.reply({
            embeds: [ig]
            })
        }).catch(e => {
            interaction.reply({
                content: 'User not found!'
            }).then(setTimeout(() => interaction.deleteReply(), 7500))
        })
    } 
}