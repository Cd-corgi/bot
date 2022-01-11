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

        if (queue && !query) { //only emiting the current song in vc
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
                            .setTitle(`${song.name}`)
                            .setThumbnail(`${song.thumbnail}`)
                            .setDescription(`${(lyrics).substring(0, 4096)}`)
                            .setColor("LUMINOUS_VIVID_PINK")
                    ]
                })
            }, 5000)
        } else
            if (query && !queue) { // only emiting in case if song-name contains data!
                let src2 = await Client.songs.search(query);

                let fsSongs = src2[0];

                let lyr = await fsSongs.lyrics();
                let nsm = await fsSongs.title();
                let tape = await fsSongs.thumbnail();

                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle(`Looking for ${nsm} ...`)
                            .setColor("YELLOW")
                    ]
                })

                setTimeout(() => {
                    interaction.editReply({
                        embeds: [
                            new MessageEmbed()
                                .setTitle(`${nsm}`)
                                .setDescription(`${(lyr).substring(0, 4096)}`)
                                .setColor("LUMINOUS_VIVID_PINK")
                        ]
                    })
                }, 5000)
            }

    }
}