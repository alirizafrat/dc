const config = require('../../BASE/config.json');
const Tantoony = require('../../BASE/Tantoony');
const { Intents } = require('discord.js');
const client = new Tantoony({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_WEBHOOKS
    ]
}, "guard_4");
client.login(process.env[client.asToken]);
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
    client.handler.mongoLogin();

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