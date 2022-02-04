const Discord = require('discord.js');
const Command = require("../../Base/Command");
const profile = require('../../../../MODELS/Economy/Profile');
const low = require('lowdb');
class Call extends Command {

    constructor(client) {
        super(client, {
            name: "afk",
            description: "Belirtilen sebepte sizi afk olarak veritabanına ekler",
            usage: "afk sebep",
            examples: ["afk cumaya gittim geleceğim"],
            category: "Genel",
            aliases: [],
            cmdChannel: "bot-komut",
            cooldown: 300000
        });
    }

    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        
    }
}

module.exports = Call;