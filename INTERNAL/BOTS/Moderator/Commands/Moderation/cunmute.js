const Command = require('../../Base/Command');
const low = require('lowdb');
const Mute = require('../../../../MODELS/Moderation/ChatMuted');
const Discord = require('discord.js');
class cunMute extends Command {
    constructor(client) {
        super(client, {
            name: "cunmute",
            description: "Belirtilen kullanıcının varolan bir ses mute cezasını kaldırır.",
            usage: "cunmute etiket/id",
            examples: ["cunmute 674565119161794560"],
            category: "Moderasyon",
            aliases: ["cun"],
            accaptedPerms: ["cmd-cmute", "cmd-all"],
            cooldown: 10000
        })
    }
    async run(client, message, args) {
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("kullaniciyok").value()} Kullanıcı bulunamadı!`).setColor('#2f3136'));
        const vData = await Mute.findOne({ _id: mentioned.user.id });
        if (!vData) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("notfound").value()} Kayıt Bulunamadı`));
        if (message.guild.members.cache.get(vData.executor).roles.highest.rawPosition > message.member.roles.highest.rawPosition) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("missingPerms").value()} Bunu yapabilmek için yeterli yetkiye sahip değilsin!`));
        await Mute.deleteOne({ _id: mentioned.user.id });
        await mentioned.roles.remove(roles.get("muted").value());
        await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));
        //this.client.cmdCooldown[message.author.id][this.info.name] = Date.now() + this.info.cooldown;
        const logChannel = message.guild.channels.cache.get(channels.get("cmd-mod").value());
        const embed = new Discord.MessageEmbed().setColor('#2f3136').setDescription(`${emojis.get("cunmute").value()} ${mentioned} kullanıcısı susturulması ${message.member} tarafından kaldırıldı!`);
        await logChannel.send(embed);
    }
}
module.exports = cunMute;