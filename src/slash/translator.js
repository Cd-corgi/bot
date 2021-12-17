const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const translate = require('@iamtraction/google-translate')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("translator")
    .setDescription("it lets you translate the words to several languages!")
    .addSubcommand(subCommand =>
        subCommand
        .setName("help")
        .setDescription("It shows how to use the command!")
    )
    .addSubcommand(subCommand =>
        subCommand
        .setName("translate")
        .setDescription("translate the text to the language that you choose!")
        .addStringOption(option =>
            option
            .setName("language")
            .setDescription("Choose the language in ISO 639-1 type")
            .setRequired(true)    
        )
        .addStringOption(option =>
            option
            .setName("text")
            .setDescription("Inster the text to translate!")
            .setRequired(true)
        )
        .addStringOption(option =>
            option
            .setName("visibility")
            .setDescription("choose one to show to the public or only for you!")
            .addChoice("public", "public")
            .addChoice("me", "me")
            .setRequired(true)
        )
    ),
    async run(client, interaction){

        if(interaction.options.getSubcommand() === "help") {
            const helpcmd = new MessageEmbed()
            .setTitle("How to use the Translator!")
            .setColor("GREEN")
            .setDescription("Sintax: \nTo set a language use as sample \"es\" is for spanish! For more information. [Click here!](http://www.mathguide.de/info/tools/languagecode.html)")
            interaction.reply({
                embeds: [helpcmd],
                ephemeral: true
            })
            return;
        } else if(interaction.options.getSubcommand() === "translate") {
            const lang = interaction.options.getString("language");
            const text = interaction.options.getString("text");
            const view = interaction.options.getString("visibility");

            if(lang.length > 3) return interaction.reply({
                content: "I allow a maximum of 2 letters to detect the language",
                ephemeral: true
            })

            if(text.length < 1) return interaction.reply({
                content: "Please provide your text a bit long",
                ephemeral: true
            })

            if(view === "me") {
                translate(`${text}`, {to: lang}).then(res => {
                    const trad = new MessageEmbed()
                    .setTitle("Translator!")
                    .setDescription(`Translate to \`${lang}\``)
                    .setColor("RANDOM")
                    .addField("Original Text", `\`\`\`${text}\`\`\``)
                    .addField("Translated Text", `\`\`\`${res.text}\`\`\``)
    
                    interaction.reply({
                        embeds: [trad],
                        ephemeral: true
                    })
                }).catch(e => {
                    interaction.reply({
                        content: `:x: | Error: ${e}`
                    }) 
                }) 
            } else if(view === "public") {
                translate(`${text}`, {to: lang}).then(res => {
                    const trad = new MessageEmbed()
                    .setTitle("Translator!")
                    .setDescription(`Translate to \`${lang}\``)
                    .setColor("RANDOM")
                    .addField("Original Text", `\`\`\`${text}\`\`\``)
                    .addField("Translated Text", `\`\`\`${res.text}\`\`\``)
    
                    interaction.reply({
                        embeds: [trad]
                    })
                }).catch(e => {
                    interaction.reply({
                        content: `:x: | Error: ${e}`
                    }) 
                }) 
            }
        }
    }
} 