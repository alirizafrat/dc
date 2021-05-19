const Discord = require('discord.js');
const Command = require("../../Base/Command");
const low = require('lowdb');
class Nerede extends Command {

    constructor(client) {
        super(client, {
            name: "nerede",
            description: "etiketlenen kişinin nerede olduğunu gösterir",
            usage: "nerede id/etiket",
            examples: ["nerede 674565119161794560"],
            aliases: ["bul"],
            category: "Genel",
            cmdChannel: "bot-komut",
            cooldown: 300000
        });
    }

    async run(client, message, args, data) {

        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const embed = new Discord.MessageEmbed().setColor('#2f3136');
        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("kullaniciyok").value()} Kullanıcı bulunamadı!`).setColor('#2f3136'));
        let desu = ``;
        if (!mentioned.voice.channel) {
            desu = `Belirtilen kullanıcı hiçbir kanalda bulunmamaktadır.`;
        } else {
            let asd = await mentioned.voice.channel.createInvite({maxUses: 1});
            desu = `${mentioned.voice.channel.name}        [▶️](https://discord.gg/${asd.code}) \`${mentioned.voice.channel.members.size}/${mentioned.voice.channel.userLimit}\``;
        }
        let lmc = message.guild.channels.cache.get(mentioned.lastMessageChannelID);
        if (!lmc) lmc = `Bulunamadı`;
        const embedi = embed.setDescription(`${mentioned} Anlık olarak\n\n**${desu}**\n\nEn son yazdığı kanal: ${lmc}`).setFooter("Sadece emojiye bas :)")
        message.channel.send(embedi);

    }
}

module.exports = Nerede;