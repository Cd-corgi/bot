const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("search-song")
        .setDescription("Search and play a song in your Voice Chat")
        .addStringOption(option =>
            option
            .setName("query")
            .setDescription("provide the song name!")
            .setRequired(true)
        ),
    async run(client, interaction) {
        const query = interaction.options.getString("query");
        const voice = interaction.member.voice.channel;

        if(!voice) return interaction.reply({ content: 'Please join in a Voice channel!', ephemeral: true })

        if(interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply({
            content: "You should stay in the same Voice channel where i am joined!",
            ephemeral: true
        })

        let result = await client.distube.search(query);

        let searchResult = "";

        for (let i = 0; i < 10; i++) {
            try {
            searchResult += await `**${i + 1}** | ${result[i].name} - \`${result[i].formattedDuration}\`\n`;
            } catch {
                searcgResult += await " ";
            }
        }

        let queryResult = new MessageEmbed()
        .setTitle(`Results!`)
        .setDescription(`${searchResult}`)
        .setFooter("Wait 30 seconds or type cancel to cancel the election!")
        .setColor("GREEN")

        let msg = await interaction.reply({
            embeds: [queryResult]
        })

        let userinput;
        const resultC = await msg.awaitMessages({
            max: 1,
            time: 60000,
            errors: ["time"],
        }).then((collected) => {
            userInput = collected.first().content;

            if(Number(userinput) <= 0 && Number(userInput) > 10) {
                return interaction.reply({ 
                    content: 'Invalid answer!',
                    ephemeral: true
                })
            }
        })

        interaction.reply({
            content: `Looking for ${result[userinput - 1].name}`
        }).then(async () => {
            setTimeout(() => interaction.deleteReply(), 10000)
        })

        interaction.client.distube.playVoiceChannel(
            interaction.member.voice.channel,
            result[userinput - 1].url,
            {
                textChannel: interaction.channel,
                member: interaction.member
            }
        )
    } /** */
}