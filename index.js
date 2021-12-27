const Discord = require("discord.js")
const client = new Discord.Client({
    partials: ["CHANNEL", "MESSAGE", "GUILD_MEMBER"],
    intents: 32767,
    allowedMentions: false
});
require("colors");
require('./src/utils/mongo')();

const { token } = require("./src/public/config.json");
const scam = require('./src/public/scam.json')
const { ownerID } = require('./src/public/config.json');
const { prefix } = require('./src/public/config.json');
const WSchema = require('./src/models/welcome')
const Nospam = require('./src/models/anti-spam')



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

    let asp = " "
    let wel = " "

    //#region check anti-spam
        let sp = NoSpam.findOne({ guildID: message.guild.id })
        let wels = WSchema.findOne({ guidID: message.guild.id })

        if(sp) {
            asp = "Enabled"
        } else {
            asp = "Disabled"
        }

        if(wels) {
            wel = "Enabled"
        } else {
            wel = "Disabled"
        }
    //#endregion check anti-spam

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
            .addField("Powered with", "Node.js V16.x (JavaScript)", true)
            .setColor("LUMINOUS_VIVID_PINK")

        const cmdembed = new Discord.MessageEmbed()
            .setTitle("Commands")
            .setThumbnail(client.user.displayAvatarURL())
            .setColor("LUMINOUS_VIVID_PINK")
            .addField("Commands", `\`${sscmdss.join("\` \`")}\``)

        const settings = new Discord.MessageEmbed()
            .setTitle(`${message.guild.name}\'s Settings`)
            .setColor("GREEN")
            .addField("💬 Anti-Spam", `\`${asp}\``, true)
            .addField("🐰 Welcome System", `\`${wel}\``, true)
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
                                },
                                {
                                    label: "Settings",
                                    description: "Check the Guild\'s settings",
                                    value: "state",
                                    emoji: "⚙"
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
                if(i.values[0] === "state") {
                    i.update({ embeds: [settings] })
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

//#region distube core
const Distube = require('distube')
client.distube = new Distube.default(client, {
    leaveOnFinish: true,
    leaveOnEmpty: true,
    searchSongs: 10
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
client.distube.on("searchResult", (message, result) => {
    let i = 0;
    message.channel.send(`**Please select one of the listed results!** \n${result.map(song => `**${++i}** - \`${song.name}\` - **${song.formattedDuration}**`).join("\n")}\n**Type anything or wait 30 seconds to cancel**`)
})
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