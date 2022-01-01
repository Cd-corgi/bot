const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const lyricsfinder = require('lyrics-finder')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("lyrics")
    .setDescription("Show the current song!")
    .addStringOption(option =>
        option
        .setName("song")
        .setDescription("provide the song name to extract their lyrics")
        .setRequired(true)
    ),
    async run(client, interaction){

        const query = interaction.options.getString("song");

        let lyrics = null;
        
        try {
            lyrics = await lyricsfinder(query, "")
            if(!lyrics) return interaction.reply({ content: "I couldn\'t find any lyrics of the song!" })
        } catch (error) {
            return interaction.reply({ content: "I couldn\'t find any lyrics of the song!" })
        }

        const ls = new MessageEmbed()
        .setTitle("Lyrics finder!")
        .setColor("RANDOM")
        .setDescription(`\`${query}\`\n${lyrics}`)
        .setTimestamp()

        if(lyrics.length > 2048) {
            interaction.reply({
                content: "Lyrics are too long!",
                ephemeral: true
            })
        }

        interaction.reply({
            embeds: [ls]
        })
    }
} //a