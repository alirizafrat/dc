const Command = require('../../Base/Command');
const low = require('lowdb');
const Discord = require('discord.js');
const { sayi } = require('../../../../HELPERS/functions');
class vMute extends Command {
    constructor(client) {
        super(client, {
            name: "vmute",
            description: "Belirtilen kullanıcıyı geçici olarak ses kanallarından susturur",
            usage: "vmute etiket/id dakika sebep",
            examples: ["vmute 674565119161794560 10 botları kötü yapıyor"],
            category: "Moderasyon",
            aliases: ["yargı", "infaz"],
            accaptedPerms: ["cmd-vmute", "cmd-all"],
            cooldown: 10000
        })
    }
    async run(client, message, args) {
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("kullaniciyok").value()} Kullanıcı bulunamadı!`).setColor('#2f3136'));
        const sebep = args.slice(2).join(" ");
        if (!sayi(args[1])) return message.channel.send(new Discord.MessageEmbed().setColor('#2f3136').setDescription(`${emojis.get("sayifalan").value()} Geçerli bir dakika girmelisin`));
        if (!sebep) return message.channel.send(new Discord.MessageEmbed().setColor('#2f3136').setDescription(`${emojis.get("soru").value()} Bir sebep girmelisin`));
        if (message.member.roles.highest.rawPosition <= mentioned.roles.highest.rawPosition) return message.channel.send(new Discord.MessageEmbed().setColor('#2f3136').setDescription(`${emojis.get("missingPerms").value()} Bunu yapmak için yeterli yetkiye sahip değilsin`));
        if (!mentioned.bannable) return message.channel.send(new Discord.MessageEmbed().setColor('#2f3136').setDescription(`${emojis.get("miisingBotPerms").value()} Bu kişiyi banlamak için yeterli yetkiye sahip değilim`));
        client.extention.emit('vMute', mentioned, message.author.id, sebep, args[1]);
        await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));
        //this.client.cmdCooldown[message.author.id][this.info.name] = Date.now() + this.info.cooldown;
        const logChannel = message.guild.channels.cache.get(channels.get("cmd-mod").value());
        const embed = new Discord.MessageEmbed().setColor('#2f3136').setDescription(`${emojis.get("vmute").value()} ${mentioned} kullanıcısı ${message.member} tarafından susturuldu!`);
        await logChannel.send(embed);

    }
}
module.exports = vMute;