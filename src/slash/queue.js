const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Check the server's song queue!"),
    async run(client, interaction){

        if(!interaction.member.voice.channel) return interaction.reply({
            content: "You should stay in a vc first!",
            ephemeral: true
        })

        const queue = client.distube.getQueue(interaction.member.voice.channel);

        const noqueue = new MessageEmbed()
        .setTitle("⚠ | There's no music in the queue..")
        .setColor("YELLOW")

        if(!queue) return interaction.reply({ embeds: [noqueue] })

        const status = `Volume: ${queue.volume} | Filter: ${queue.filters.join(', ') || 'Disabled'}`

        const newqueue = new MessageEmbed()
        .setTitle(`${interaction.guild.name}\'s Queue`)
        .setDescription(queue.songs.map((song, id) => `**${id + 1}** - \`${song.name}\` - \`${song.formattedDuration}\``).slice(0, 10).join("\n"))
        .setColor("RED")
        .setTimestamp()
        .setFooter(status)

        interaction.reply('🔍 | Fetching queue ...').then(setTimeout(() => interaction.editReply({ content: "_ _", embeds: [newqueue] }), 3000))

    }
}