module.exports = {
    name: 'sim',
    alias: ["boost"],
    run: async(client, message, args) => {
        client.emit("guildMemberUpdate", message.member)
    }
}