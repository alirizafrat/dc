const Discord = require('discord.js');
const Command = require("../../Base/Command");
const Os = require('os');
const Pm = require('pm2');
const low = require('lowdb');
const { stripIndents } = require('common-tags');
class Call extends Command {

    constructor(client) {
        super(client, {
            name: "botinfo",
            description: "Botun durumunu gösterir",
            usage: "botinfo",
            examples: ["botinfo"],
            category: "Genel",
            aliases: ["bi"],
            cmdChannel: "bot-komut",
            cooldown: 300000
        });
    }

    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));

        const embed = new Discord.MessageEmbed().setDescription(stripIndents`
        **İşletim Sistemi:** \`${Os}\`



        `);
        
    }
}

module.exports = Call;