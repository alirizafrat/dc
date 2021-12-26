const Tantoony = require('../../BASE/Tantoony');
const { Intents } = require('discord.js');
const client = new Tantoony({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_BANS
    ]
}, __dirname.split('\\').pop());
client.on("guildUnavailable", async (guild) => { console.log(`[UNAVAIBLE]: ${guild.name}`) })
    .on("disconnect", () => client.logger.log("Bot is disconnecting...", "disconnecting"))
    .on("reconnecting", () => client.logger.log("Bot reconnecting...", "reconnecting"))
    .on("error", (e) => client.logger.log(e, "error"))
    .on("warn", (info) => client.logger.log(info, "warn"));
process.on("unhandledRejection", (err) => { client.logger.log(err, "caution") });
process.on("warning", (warn) => { client.logger.log(warn, "varn") });