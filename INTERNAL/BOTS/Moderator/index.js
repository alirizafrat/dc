const config = require('../../BASE/config.json');
const Tantoony = require('./Base/Tantoony');
const { Intents } = require('discord.js');
const client = new Tantoony({
    ws: {
        intents: new Intents(Intents.ALL).remove([
            //"GUILDS",
            "GUILD_MEMBERS",
            "GUILD_BANS",
            "GUILD_EMOJIS",
            "GUILD_INTEGRATIONS",
            "GUILD_WEBHOOKS",
            "GUILD_INVITES",
            //"GUILD_VOICE_STATES",
            //"GUILD_PRESENCES",
            //"GUILD_MESSAGES",
            //"GUILD_MESSAGE_REACTIONS",
            "GUILD_MESSAGE_TYPING",
            //"DIRECT_MESSAGES",
            "DIRECT_MESSAGE_REACTIONS",
            "DIRECT_MESSAGE_TYPING"
        ])
    }
});
client.login(config.Moderator);
client.handler.mongoLogin();
const fs = require('fs');
const util = require('util');
const readdir = util.promisify(fs.readdir);
const init = async () => {
    let directories = await readdir("./Commands/");
    client.logger.log(`Loading a total of ${directories.length} categories.`, "category");
    directories.forEach(async (dir) => {
        let commands = await readdir("./Commands/" + dir + "/");
        commands.filter((cmd) => cmd.split(".").pop() === "js").forEach(async (cmd) => {
            const response = client.loadCommand("./Commands/" + dir, cmd);
            if (response) {
                client.logger.log(response, "error");
            }
        });
    });
};
init();
client.handler.prototype.events(client, '/Events', __dirname);
client.handler.prototype.server(client, '/../../EVENTS', __dirname);
client.on("guildUnavailable", async (guild) => { console.log(`[UNAVAIBLE]: ${guild.name}`) })
    .on("disconnect", () => client.logger.log("Bot is disconnecting...", "disconnecting"))
    .on("reconnecting", () => client.logger.log("Bot reconnecting...", "reconnecting"))
    .on("error", (e) => client.logger.log(e, "error"))
    .on("warn", (info) => client.logger.log(info, "warn"));
process.on("unhandledRejection", (err) => { client.logger.log(err, "caution") });
process.on("warning", (warn) => { client.logger.log(warn, "varn") });
process.on("beforeExit", () => { console.log('Bitiriliyor...'); });
