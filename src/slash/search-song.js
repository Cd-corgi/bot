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

        //#region a
            /*
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
                embeds: [
                    new MessageEmbed()
                        .setDescription(`🔎 Please Select one of the results below!`)
                        .setFooter("Or just wait for 20 seconds to cancel the searching!")
                        .setColor("GREEN")
                ],
                components: [row]
            }).then(() => setTimeout(() => interaction.deleteReply(), 20000))

            let filter = (i) => i.user.id === interaction.user.id;

            let collector = await interaction.channel.createMessageComponentCollector({
                filter,
                time: 20000,
                max: 1,
            });

            collector.on("collect", async (collected) => {
                client.distube.playVoiceChannel(
                    interaction.member.voice.channel,
                    result[collected.values[0]]?.url,
                    {
                        textChannel: interaction.channel,
                        member: interaction.member
                    }
                )
            })

            collector.on("end", async (collected) => {
                interaction.channel.send({
                    content: `Request ended ...`,
                    ephemeral: false
                }).then(() => setTimeout(() => interaction.delete(), 5000))
                return;
            })
        })
            */
        //#endregion a
    
        const msg_filter = m => m.id === interaction.user.id;
        const results = await client.distube.search(song);
        const rls = results.slice(0, 10)
        const embedR = new MessageEmbed()
        .setTitle(`🔎 **Results for ${song}**`)
        .setColor("GREEN")
        .setDescription(`${rls.map((song, id) => `**${i + 1}** - ${song.name} | ${song.formattedDuration}`).join("\n")}`)
        .setFooter("Choose between 1 or 10 to choose your song! Type anything to cancel!")

        interaction.reply({embeds: [embedR]})

        const number = await interaction.channel.awaitMessages({ filter: msg_filter, max: 1 }).then(collected => { return collected.first().content });

        if(parseInt(number) > 0 && parseInt(number) <= 10) {
            client.distube.playVoiceChannel(
                interaction.member.voice.channel,
                rslts[parseInt(number)-1],
                {
                    textChannel: interaction.channel,
                    member: interaction.member,
                }
            )
        }
    }
}