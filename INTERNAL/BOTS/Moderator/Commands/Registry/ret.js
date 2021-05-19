const Command = require('../../Base/Command');
const Discord = require('discord.js');
const tbans = require('../../../../MODELS/Moderation/Ban');
const low = require('lowdb');
class Ret extends Command {
    constructor(client) {
        super(client, {
            name: "ret",
            description: "Kayıtsız bir üyeyi reddetmek için kullanılır",
            usage: "ret etiket/id",
            examples: ["ret 674565119161794560"],
            category: "Kayıt",
            aliases: ["reddet"],
            cmdChannel: "suspicious",
            accaptedPerms: ["cmd-registry", "cmd-all"],
            cooldown: 10000
        });
    };
    async run(client, message, args) {
        client = this.client;
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("kullaniciyok").value()} Kullanıcı bulunamadı!`).setColor('#2f3136'));
        if (!mentioned.roles.cache.has(roles.get("welcome").value())) return message.channel.send(new Discord.MessageEmbed().setDescription(`Sadece kayıtsızları reddedebilirsin!`));
        await mentioned.ban({ reason: "Reddedildi." });
        let ban = await tbans.findOne({ _id: mentioned.user.id });
        if (!ban) {
            let gonnasave = await tbans({ _id: mentioned.user.id, executor: message.author.id, reason: "Reddedildi", duration: 1, created: new Date() });
            await gonnasave.save();
        }
        await message.guild.channels.cache.get(channels.get("mod-registry").value()).send(new Discord.MessageEmbed().setDescription(`${message.member} yetkilisi ${mentioned} kişisini reddetti.`));
        await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));
    }
}
module.exports = Ret;