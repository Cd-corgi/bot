const Discord = require("discord.js")
const client = new Discord.Client({
    partials: ["CHANNEL", "MESSAGE", "GUILD_MEMBER"],
    intents: 32767,
    allowedMentions: false
});
require("colors");
require('./src/utils/mongo')();

const { DiscordTogether } = require('discord-together')

client.discordTogether = new DiscordTogether(client);

const { token } = require("./src/public/config.json");
const scam = require('./src/public/scam.json')
const { ownerID } = require('./src/public/config.json');
const { prefix } = require('./src/public/config.json');
const WSchema = require('./src/models/welcome')
const react = require('./src/models/self-roles')
const Nospam = require('./src/models/anti-spam')
const boost = require('./src/models/boost');



client.on("ready", async () => {
    setInterval(() => {
        let status = [
            "Judy hops never was here 🐰",
            "R.I.P OtterBot, We'll miss you~",
            "✅ Slash Commands Deployed",
            "Pong! 🏓",
            "Music Commands Deployed!"
        ]

        let rand = Math.floor(Math.random() * (status.length - 1) + 1);
        client.user.setActivity(`${status[rand]} | ${client.guilds.cache.size} Guilds & ${client.users.cache.size} users!`);
    }, 30000);
    console.clear();
    console.log("[✅] Ready".green);

});


//#region unhandled
process.on('unhandledRejection', error => {
    console.error(`[UNHANDLED ALARM] ${error}`.blue);
});

client.on('shardError', error => {
    console.error(`[SHARD ALARM] ${error}`.blue);
});
//#endregion unhandled

//#region event handler

const fs = require('fs');

let { readdirSync } = require('fs');

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync("./src/Commands/").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const cmd = require(`./src/Commands/${file}`);
    client.commands.set(cmd.name, cmd);
    console.log(`[✔] ${file} have been loaded!`)
}

client.slashCommands = new Discord.Collection();
const slashCommand = fs.readdirSync("./src/slash/").filter(file => file.endsWith(".js"))

for (const file of slashCommand) {
    const scmd = require(`./src/slash/${file}`);
    client.slashCommands.set(scmd.data.name, scmd)
    console.log(`[⚠ SLASH] ${file} have been loaded!`.yellow);
}

client.on("interactionCreate", async (interaction) => {

    if (interaction.isCommand || interaction.isContextMenu) {
        const slashcmds = client.slashCommands.get(interaction.commandName)

        if (!slashcmds) return;

        try {
            await slashcmds.run(client, interaction)
        } catch (error) {
            console.log(`[❌] ${error}`.red)
            console.log(error)
        }
    }


});

client.on("interactionCreate", async (interaction) => {

    if (!interaction.isButton() || !interaction.guild) return;

    const emoji = interaction?.component?.emoji;

    const menu = await react.findOne({ guild: interaction.guild.id })


    if (!menu || menu.roles.length === 0 || !menu.roles.some(v => v.emoji === emoji.id || v.emoji === emoji.name)) return;

    const member = interaction.guild.members.cache.get(interaction.user.id);

    menu.roles.forEach(v => {
        const role = interaction.guild.roles.cache.get(v.role);

        if ((v.emoji !== emoji.name && v.emoji !== emoji.id)) return;

        if (!member.roles.cache.has(role.id)) {
            member.roles.add(role).then(() => {
                interaction.reply({ content: `I gave you the **${role.name}** role in ${interaction.guild.name}`, ephemeral: true })
            }).catch(() => {
                interaction.reply({ content: `I was unable to give you the role in ${interaction.guild.name}`, ephemeral: true })
            })
        } else {
            member.roles.remove(role).then(() => {
                interaction.reply({ content: `I removed the **${role.name}** role from you in ${interaction.guild.name}`, ephemeral: true })
            }).catch(() => {
                interaction.reply({ content: `I was unable to remove a role from you in ${interaction.guild.name}`, ephemeral: true })
            })
        }
    })
})


client.on("guildMemberAdd", async (member, guild) => {
    WSchema.findOne({ guildID: member.guild.id }, async (err, data) => {
        if (err) throw err;
        if (!data) {
            return;
        } else {
            const chan = member.guild.channels.cache.get(data.channelID);
            const msg = data.welMessage || `Welcome to ${member.guild.id}, ${member.user}`;

            const wembed = new Discord.MessageEmbed()
                .setTitle(`Welcome ${member.user.tag} to ${member.guild.name}`)
                .setColor("RANDOM")
                .setDescription(`${msg}`)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))

            chan.send({ embeds: [wembed] })
        }
    })
})

//#endregion event handler

//#region event msg

client.on("messageCreate", async (message) => {


    if (message.author.bot) return;
    if (message.channel.type == "dm" || !message.guild) return;

    const { prefix } = require("./src/public/config.json");

    for (const bad of scam) {
        if (message.content.includes(bad)) {
            message.delete();
            let embed = new Discord.MessageEmbed()
                .setAuthor(message.author.tag)
                .setTitle("[:x: ANTI-SCAM] - NO SCAM LINKS")
                .setColor("RED")
            message.author.send({
                embeds: [embed]
            })
        }
    }

    if (message.channel.partial) await message.channel.fetch();
    if (message.partial) await message.fetch();
    if (message.content === `<@!${client.user.id}>` || message.content === `<@${client.user.id}>`) {
        const sscmdss = [];

        let gg = readdirSync('./src/slash/').filter(file => file.endsWith('.js'));

        for (const file of gg) {
            let gag = require(`./src/slash/${file}`);
            sscmdss.push(gag.data.name);
        }
        const embeds = new Discord.MessageEmbed()
            .setTitle(`${client.user.username}\'s info`)
            .setDescription(`You just mentioned me! theres my main information!`)
            .setThumbnail(client.user.displayAvatarURL())
            .addField("Owner", `<@${ownerID}>`, true)
            .addField("Prefix", `\`${prefix}\` <t:1651294800:R> will be replaced with \`/\``, true)
            .addField("Invite this Bot", `[\[Click Here!\]](https://discord.com/api/oauth2/authorize?client_id=915958910022746203&permissions=1240456359638&scope=bot%20applications.commands)`, true)
            .addField("Powered with", "Node.js V16.x (JavaScript)", true)
            .setColor("LUMINOUS_VIVID_PINK")

        const cmdembed = new Discord.MessageEmbed()
            .setTitle("Commands")
            .setThumbnail(client.user.displayAvatarURL())
            .setColor("LUMINOUS_VIVID_PINK")
            .addField("Commands", `\`${sscmdss.join("\` \`")}\``)

        message.channel.send({
            embeds: [embeds],
            components: [
                new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageSelectMenu()
                            .setCustomId("m1")
                            .setPlaceholder("Use me to reveal my commands!")
                            .addOptions([
                                {
                                    label: "Info",
                                    description: "About my prefix and more!",
                                    value: "main",
                                    emoji: "🐰"
                                },
                                {
                                    label: "Commands",
                                    description: "Show the existing Commands!",
                                    value: "cmds",
                                    emoji: "📌"
                                }
                            ])
                    )
            ]
        }).then(async (m) => {
            const collector = m.createMessageComponentCollector({ filter: i => i.user.id === message.author.id });

            collector.on("collect", async (i) => {
                if (i.values[0] === "main") {
                    i.update({ embeds: [embeds] })
                }
                if (i.values[0] === "cmds") {
                    i.update({ embeds: [cmdembed] })
                }
            })
        })
    }
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    let cmd = client.commands.find((c) => c.name === command || c.alias && c.alias.includes(command))

    if (cmd) {
        cmd.run(client, message, args)
    } else {
        message.channel.send("Unknown Command ...")
    }


});

//#endregion event msg

//#region event detection
client.on("guildMemberUpdate", async (oldMember, newMember) => {
    const oldStatus = oldMember.premiumSinceTimestamp
    const newStatus = newMember.premiumSinceTimestamp;
    let bg = await boost.findOne({ guild: newMember.guild.id })
    if (!bg) {
        return;
    } else {
        if (!oldStatus && newStatus) {

            const boosted = new Discord.MessageEmbed()
            .setTitle(`Server Boosting!`)
            .setDescription(`Someone super dope like ${newMember.user.username} boosted this server!`)
            .setImage("https://media.giphy.com/media/oCn6eLwzPmWRdHYHaK/giphy.gif")
            .setColor("FC33FF")
            .setTimestamp()

            client.channel.cache.get(boost.channel).send({
                embeds: [boosted]
            })
        } else 
        if (oldStatus && !newStatus) {
            client.channel.cache.get(boost.channel).send(`${newMember.user.username} have removed the boost! *sad song*`)
        }
    }
})
//#endregion event detenction

//#region distube core
const Distube = require('distube')
const SoundCloudPlugin = require('@distube/soundcloud');
const SpotifyPlugin = require('@distube/spotify');
client.distube = new Distube.default(client, {
    leaveOnFinish: true,
    leaveOnEmpty: true,
    searchSongs: 10,
    emptyCooldown: 0,
    // plugins: [new SoundCloudPlugin(), new SpotifyPlugin()]
});

const fisi = new Discord.MessageEmbed()
    .setTitle("📤 | leaving Voice Channel. end of Queue!")
    .setColor("ORANGE")
    .setFooter("🐰 | Thanks for use Bunny Hops.inc")

const alone = new Discord.MessageEmbed()
    .setTitle("🚪 | The party is over... no one there!")
    .setColor("DARK_RED")

client.distube.on("finish", queue => queue.textChannel.send({ embeds: [fisi] }))
client.distube.on("empty", queue => queue.textChannel.send({ embeds: [alone] }))
client.distube.on("searchResult", (message, result, song, args) => {
    let i = 0
    message.channel.send('Searching...').then(msg => {
        msg.edit(`**Choose an option from below**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`).then(msg => {
            setTimeout(() => msg.delete(), 15000)
        })
    })
})
client.distube.on("searchCancel", message => { message.channel.send("Search Canceled!") })
client.distube.on("searchInvalidAnswer", message => { message.channel.send("Invalid numer of the song!") })
client.distube.on("searchNoResult", (query, message) => { message.channel.send(`No results for ${query}`) })
client.distube.on("searchDone", message => { message.channel.send(`Fetching ...`) })
client.distube.on("error", (textChannel, e) => {
    textChannel.send({ content: `:x: | Error: ${e}` })
    console.log(e);
})

for (const file of readdirSync('./distube_events/')) {
    if (file.endsWith('.js')) {
        let fileName = file.substring(0, file.length - 3)
        let fileContent = require(`./distube_events/${file}`)
        client.distube.on(fileName, fileContent.bind(null, client))
    }
}

//#endregion distube core

//#region anti-spam timeout
const userSpam = new Map();

client.on("messageCreate", async (message) => {

    Nospam.findOne({ guildID: message.guild.id }, async (err, data) => {
        if (err) throw err;
        if (data) {

            let usera = message.author;

            if (userSpam.has(message.author.id)) {
                const userData = userSpam.get(message.author.id);
                let { msgCount } = userData;

                msgCount += 1;

                userData.msgCount = msgCount;
                userSpam.set(message.author.id, userData);

                if (msgCount >= 3) {
                    message.delete();
                }

                if (msgCount >= 5) {
                    message.delete();
                    message.guild.members.cache.find(m => m.id === usera.id).timeout(15 * 60 * 1000, "Spamming messages!")
                    const stoo = new Discord.MessageEmbed()
                        .setTitle(`[ANTI-SPAM] ${usera.username} has been muted!`)
                        .setDescription(`Reason: \`Spam\`\nTimeout: \`15 Minutes\``)

                    message.channel.send({
                        embeds: [stoo]
                    })
                }

                setTimeout(() => {
                    userSpam.delete(message.author.id);
                }, 10000)

            } else {
                userSpam.set(message.author.id, {
                    msgCount: 1
                })
                setTimeout(() => {
                    userSpam.delete(message.author.id);
                }, 10000)
            }

        } else {
            return;
        }
    })

})
//#endregion anti-spam timeout

client.login(token).catch(error => {
    console.log(`${error}`.red);
});