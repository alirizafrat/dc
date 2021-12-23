const config = require('../../BASE/config.json');
const Tantoony = require('../../BASE/Tantoony');
const { Intents } = require('discord.js');
const client = new Tantoony({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_PRESENCES
    ]
});
client.login(config.Organizer);
require('mongoose').connect(config.mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    client.logger.log("Connected to the Mongodb database.", "mngdb");
}).catch((err) => {
    client.logger.log("Unable to connect to the Mongodb database. Error: " + err, "error");
});
client.handler.prototype.events(client, '/Events', __dirname);
client.handler.prototype.server(client, '/../../EVENTS', __dirname);
client.on("guildUnavailable", async (guild) => console.log(`[UNAVAIBLE]: ${guild.name}`))
    .on("disconnect", () => client.logger.log("Bot is disconnecting...", "disconnecting"))
    .on("reconnecting", () => client.logger.log("Bot reconnecting...", "reconnecting"))
    .on("error", (e) => client.logger.log(e, "error"))
    .on("warn", (info) => client.logger.log(info, "warn"));
process.on("unhandledRejection", (err) => {
    client.logger.log(err, "caution")
});
process.on("warning", (warn) => {
    client.logger.log(warn, "varn")
});