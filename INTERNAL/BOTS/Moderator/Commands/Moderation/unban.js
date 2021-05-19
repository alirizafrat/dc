const Command = require('../../Base/Command');
const Bans = require('../../../../MODELS/Moderation/Ban');
const low = require('lowdb');
const { MessageEmbed } = require('discord.js');
class unBan extends Command {
    constructor(client) {
        super(client, {
            name: "unban",
            description: "Belirtilen kullanıcının varolan banını kaldırır",
            usage: "unban id",
            examples: ["unban 674565119161794560"],
            category: "Moderasyon",
            aliases: ["af"],
            accaptedPerms: ["cmd-ban", "cmd-all"],
            cooldown: 10000
        })
    }
    async run(client, message, args) {
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const user = await message.guild.fetchBan(args[0]);
        if (!user) return message.channel.send(new MessageEmbed().setDescription(`${emojis.get("notfound").value()} Kullanıcı Bulunamadı!`));
        const BanDoc = await Bans.findOne({ _id: args[0] });
        if (BanDoc && message.guild.members.cache.get(BanDoc.executor).roles.highest.rawPosition > message.member.roles.highest.rawPosition) return message.channel.send(new MessageEmbed().setDescription(`${emojis.get("missingPerms").value()} Bu kullanıcının banını kaldıracak yetkiye sahip değilsin!`));
        if (BanDoc) await Bans.deleteOne({_id: args[0]});
        await message.guild.members.unban(args[0], `${message.author.username} tarafından kaldırıldı`);
        await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));
        //this.client.cmdCooldown[message.author.id][this.info.name] = Date.now() + this.info.cooldown;
        const logChannel = message.guild.channels.cache.get(channels.get("cmd-mod").value());
        const embed = new MessageEmbed().setColor('#2f3136').setDescription(`${emojis.get("unban").value()} ${mentioned} kullanıcısı banı ${message.member} tarafından kaldırıldı!`);
        await logChannel.send(embed);
    }
}
module.exports = unBan;