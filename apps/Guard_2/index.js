const Tantoony = require('../../BASE/Tantoony');
const { Intents } = require('discord.js');
const client = new Tantoony({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_PRESENCES
    ]
}, __dirname.split('/').pop());
process.on("warning", (warn) => { client.logger.log(warn, "varn") });
process.on("beforeExit", () => { console.log('Bitiriliyor...'); });