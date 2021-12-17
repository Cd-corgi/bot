const fs = require('fs');
const Discord = require("discord.js");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { botID } = require('./src/public/config.json');
const { token } = require('./src/public/config.json');
require("colors");

const commands = []

const slashCommandsFiles = fs.readdirSync("./src/slash").filter(file => file.endsWith(".js"))

for(const file of slashCommandsFiles) {
    const slash = require(`./src/slash/${file}`)
    commands.push(slash.data.toJSON())
}

const rest = new REST({
    version: "9"
}).setToken(token)

createSlash();

async function createSlash() {
    try {
        await rest.put(
            Routes.applicationCommands(botID), {
                body: commands
            }
        ) 
        console.log("[/] Slash Commands have been added!".yellow)
    }catch(error) {
       console.log(`[❌] ERROR: ${error}`.red)     
    }
}

