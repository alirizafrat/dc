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
}, __dirname.split('\\').pop());
client.on("guildUnavailable", async (guild) => { console.log(`[UNAVAIBLE]: ${guild.name}`) })
    .on("disconnect", () => client.logger.log("Bot is disconnecting...", "disconnecting"))
    .on("reconnecting", () => client.logger.log("Bot reconnecting...", "reconnecting"))
    .on("error", (e) => client.logger.log(e, "error"))
    .on("warn", (info) => client.logger.log(info, "warn"));
process.on("unhandledRejection", (err) => { client.logger.log(err, "caution") });
process.on("warning", (warn) => { client.logger.log(warn, "varn") });
process.on("beforeExit", () => { console.log('Bitiriliyor...'); });
