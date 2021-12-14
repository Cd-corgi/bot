module.exports = {
    name: "ping",
    alias: ["test"],
    run: async (client, message, args) => {
        message.channel.send("Pong! 🏓 \`"+ client.ws.ping +"ms\`")
    }
}