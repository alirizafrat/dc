const Command = require('../../Base/Command');
const Discord = require('discord.js');
const low = require('lowdb');
const { sayi } = require('../../../../HELPERS/functions');
class Isim extends Command {
    constructor(client) {
        super(client, {
            name: "isim",
            description: "kayıt sırasında kişinin adını değiştirmek için kullanılır.",
            usage: "isim etiket/id isim yaş",
            examples: ["isim 674565119161794560 orhan yalın 20"],
            category: "Kayıt",
            aliases: ["i", "ism"],
            cmdChannel: "exe-registry",
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
        if (!mentioned.roles.cache.has(roles.get("welcome").value()) && (mentioned.roles.cache.size > 1)) return message.channel.send(new Discord.MessageEmbed().setDescription(`Sanırım bu üye zaten kayıtlı!`));
        let rawName = args.slice(1);
        if (!rawName) return message.channel.send(new Discord.MessageEmbed().setDescription(`Bir isim girmelisin..`));
        let nameAge = rawName.map(i => i[0].toUpperCase() + i.slice(1).toLowerCase()).join(' ');
        let point = '•';
        //if (mentioned.user.username.includes(client.config.tag)) point = client.config.tag;
        await mentioned.setNickname(`${point} ${nameAge}`);
        await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));
        await message.channel.send(new Discord.MessageEmbed().setDescription(`${mentioned} kişisinin adı başarıyla \`${point} ${nameAge}\` olarak ayarlandı!`));
        await message.guild.channels.cache.get(channels.get("ast-registry").value()).send(new Discord.MessageEmbed().setDescription(`${mentioned} kişisinin ismi ${message.member} tarafından değiştirildi.`));
    }
}
module.exports = Isim;