const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("search-song")
        .setDescription("Let the bot search a song!")
        .addStringOption(option =>
            option
                .setName("query")
                .setDescription("Provide teh name of the song to search!")
                .setRequired(true)
        ),
    async run(client, interaction) {
        const song = interaction.options.getString("query");

        const voice = interaction.member.voice.channel;

        if (!voice) return interaction.reply({
            content: "Make sure to join in a VC first!",
            ephemeral: true
        })

        if (interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply({
            content: "You should stay in the same Voice channel where i am joined!",
            ephemeral: true
        })

        client.distube.search(song, {
            limit: 10,
            type: "video",
            safeSearch: false,
        }).then(async (result) => {
            const selector = new Discord.MessageSelectMenu();
                selector.setCustomId("select")
                selector.setMaxValues(1)
                selector.setMinValues(1)
            result.map((song, i) =>
                selector.addOptions([
                    {
                        label: `${String(song.name)}`,
                        value: String(i),
                        description: `${song.formattedDuration}`,
                        emoji: "🎵"
                    },
                ])
            ).join("\n");

            let row = new Discord.MessageActionRow().addComponents(selector);
            let msg = await interaction.reply({
                content: `🔎 **Choose your song below!**`,
                components: [row]
            })

            let filter = (i) => i.user.id === interaction.user.id;

            let collector = await interaction.channel.createMessageComponentCollector({
                filter,
                time: 0,
                max: 1,
            });

            collector.on("collect", async (collected) => {
                client.distube.play(interaction, result[collected.values[0]]?.url);
            })
        })

    }
}