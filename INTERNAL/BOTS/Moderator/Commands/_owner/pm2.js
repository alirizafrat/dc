const Command = require("../../Base/Command");
const low = require('lowdb');
const Discord = require('discord.js');
const { stripIndents } = require("common-tags");
const children = require("child_process");
const VoiceChannels = require("../../../../MODELS/Datalake/VoiceChannels");
class pm2 extends Command {

    constructor(client) {
        super(client, {
            name: "pm2",
            description: "Açıklama Belirtilmemiş.",
            usage: "Kullanım Belirtilmemiş.",
            examples: ["Örnek Bulunmamakta"],
            category: "OWNER",
            aliases: [],
            accaptedPerms: [],
            cooldown: 5000,
            enabled: true,
            adminOnly: false,
            ownerOnly: false,
            onTest: false,
            rootOnly: true,
            dmCmd: false
        });
    }

    async run(client, message, args, data) {

        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        function clean(text) {
            if (typeof (text) === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else return text;
        }
        if (args[0] === 'logs') return;
        const ls = children.exec(`pm2 ${args.join(' ')}`);
        ls.stdout.on('data', function (data) {
            message.channel.send(`\`\`\`${data}\`\`\``);
        });
        


    }

}

module.exports = pm2;