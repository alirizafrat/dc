const config = require('../../BASE/config.json');
const Tantoony = require('../../BASE/Tantoony');
const { Intents, Permissions } = require('discord.js');
const client = new Tantoony({
    ws: {
        intents: new Intents(Intents.ALL).remove([
            //"GUILDS",
            "GUILD_MEMBERS",
            "GUILD_BANS",
            "GUILD_EMOJIS",
            //"GUILD_INTEGRATIONS",
            //"GUILD_WEBHOOKS",
            "GUILD_INVITES",
            "GUILD_VOICE_STATES",
            //"GUILD_PRESENCES",
            "GUILD_MESSAGES",
            "GUILD_MESSAGE_REACTIONS",
            "GUILD_MESSAGE_TYPING",
            "DIRECT_MESSAGES",
            "DIRECT_MESSAGE_REACTIONS",
            "DIRECT_MESSAGE_TYPING"
        ])
    }
});
client.login(config.Organizer);
const Mongoose = require('mongoose');
const fs = require('fs');
const util = require('util');
const readdir = util.promisify(fs.readdir);
const init = async () => {
    let eventFolders = await readdir("./Events/");
    client.logger.log(`Loading a total of ${eventFolders.length} categories.`, "category");
    eventFolders.filter(dir => dir !== 'Terminal').forEach(async (dir) => {
        let events = await readdir("./Events/" + dir + "/");
        events.filter((evnt) => evnt.split(".").pop() === "js").forEach((file) => {
            console.log("loading event: " + file)
            const event = new (require(`./Events/${dir}/${file}`))(client);
            client.on(dir, (...args) => event.run(...args));
            delete require.cache[require.resolve(`./Events/${dir}/${file}`)];
        });
    });
    Mongoose.connect(config.mongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }).then(() => {
        client.logger.log("Connected to the Mongodb database.", "mngdb");
    }).catch((err) => {
        client.logger.log("Unable to connect to the Mongodb database. Error: " + err, "error");
    });
};
init();
client.handler.prototype.events(client, '/Events/other', __dirname);
client.handler.prototype.server(client, '/../../EVENTS', __dirname);
client.on("guildUnavailable", async (guild) => { console.log(`[UNAVAIBLE]: ${guild.name}`) })
    .on("disconnect", () => client.logger.log("Bot is disconnecting...", "disconnecting"))
    .on("reconnecting", () => client.logger.log("Bot reconnecting...", "reconnecting"))
    .on("error", (e) => client.logger.log(e, "error"))
    .on("warn", (info) => client.logger.log(info, "warn"));
process.on("unhandledRejection", (err) => { client.logger.log(err, "caution") });
process.on("warning", (warn) => { client.logger.log(warn, "varn") });