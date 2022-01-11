const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const Genius = require('genius-lyrics')
const { GENIUS_API } = require('../public/config.json')
const Client = new Genius.Client(GENIUS_API)

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lyrics")
        .setDescription("Let the bot find your lyrics!")
        .addStringOption(option =>
            option
                .setName("song-name")
                .setDescription("Provide the song to search, or search the current song!")
                .setRequired(false)
        ),
    async run(client, interaction) {
        const query = interaction.options.getString("song-name");
        const queue = client.distube.getQueue(interaction.member.voice.channel);

        if (queue) {
            let song = queue.songs[0];

            const searches = await Client.songs.search(queue.songs[0].name);
            const fSong = searches[0];

            const lyrics = await fSong.lyrics();

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle(`Looking for lyrics of the current song!`)
                        .setColor("YELLOW")
                ]
            });

            setTimeout(() => {
                interaction.editReply({
                    embeds: [
                        new MessageEmbed()
                            .setAuthor(`📨 | Lyrics`, song.thumbnail)
                            .setThumbnail(`${song.thumbnail}`)
                            .setDescription(`${(lyrics).substring(0, 4096)}`)
                            .setColor("LUMINOUS_VIVID_PINK")
                    ]
                })
            }, 5000)
        } else {
            return;
        }

    }
}