const Command = require('../../Base/Command');
const low = require('lowdb');
const Jails = require('../../../../MODELS/Moderation/Jails');
const { MessageEmbed } = require('discord.js');
class unJail extends Command {
    constructor(client) {
        super(client, {
            name: "unjail",
            description: "Belirtilen kullanıcının varolan jail cezasını kaldırır",
            usage: "unjail etiket/id",
            examples: ["unjail 674565119161794560"],
            category: "Moderasyon",
            aliases: ["unj"],
            accaptedPerms: ["cmd-jail", "cmd-all"],
            cooldown: 10000
        })
    }
    async run(client, message, args) {
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.channel.send(new MessageEmbed().setDescription(`${emojis.get("kullaniciyok").value()} Kullanıcı bulunamadı!`).setColor('#2f3136'));
        const Data = await Jails.findOne({ _id: mentioned.user.id });
        if (!Data) return message.channel.send(new MessageEmbed().setDescription(`${emojis.get("notfound").value()} Kayt Bulunamadı!`));
        await mentioned.roles.add(Data.roles.map(rname => message.guild.roles.cache.find(role => role.name === rname)));
        await mentioned.roles.remove(roles.get("prisoner").value());
        await Jails.deleteOne({ _id: mentioned.user.id });
        await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));
        //this.client.cmdCooldown[message.author.id][this.info.name] = Date.now() + this.info.cooldown;
        const logChannel = message.guild.channels.cache.get(channels.get("cmd-mod").value());
        const embed = new MessageEmbed().setColor('#2f3136').setDescription(`${emojis.get("unjail").value()} ${mentioned} kullanıcısı jail'i ${message.member} tarafından kaldırıldı!`);
        await logChannel.send(embed);
    }
}
module.exports = unJail;