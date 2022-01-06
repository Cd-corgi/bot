module.exports = {
    name: 'sim',
    alias: ["boost"],
    run: async(client, message, args) => {
        client.emit("guildMemberUptdate", message.member)
    }
}