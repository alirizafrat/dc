const config = require('../../BASE/config.json');
const Tantoony = require('../../BASE/Tantoony');
const { Intents } = require('discord.js');
const client = new Tantoony({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_PRESENCES
    ]
});
client.login(config.Manager);
const Mongoose = require('mongoose');
const fs = require('fs');
const util = require('util');
const readdir = util.promisify(fs.readdir);
const init = async () => {
    const evtFiles = await readdir("./Controllers/");
    client.logger.log(`Loading a total of ${evtFiles.length} Controllers.`, "category");
    evtFiles.forEach((file) => {
        const eventName = file.split(".")[0];
        client.logger.log(`Loading Event: ${eventName}`, "load");
        const event = new (require(`./Controllers/${file}`))(client);
        client.on("ready", (...args) => event.run(...args));
        delete require.cache[require.resolve(`./Controllers/${file}`)];
    });
    client.handler.mongoLogin();
};
init();
client.on("guildUnavailable", async (guild) => { console.log(`[UNAVAIBLE]: ${guild.name}`) })
    .on("disconnect", () => client.logger.log("Bot is disconnecting...", "disconnecting"))
    .on("reconnecting", () => client.logger.log("Bot reconnecting...", "reconnecting"))
    .on("error", (e) => client.logger.log(e, "error"))
    .on("warn", (info) => client.logger.log(info, "warn"));
process.on("unhandledRejection", (err) => { client.logger.log(err, "caution") });
process.on("warning", (warn) => { client.logger.log(warn, "varn") });