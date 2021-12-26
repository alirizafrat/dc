const Tantoony = require('../../Base/Tantoony');
const { Intents } = require('discord.js');
const client = new Tantoony({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_INTEGRATIONS
    ]
}, __dirname.split('/').pop());
client.login(process.env[client.asToken]);
client.handler.loadInt();
client.handler.events('/Events', __dirname);
client.handler.server('/../../EVENTS', __dirname);
process.on("warning", (warn) => { client.logger.log(warn, "varn") });
process.on("beforeExit", () => { console.log('Bitiriliyor...'); });
