const Permissions = require('../../../MODELS/Temprorary/Permissions');
const Punishments = require('../../../MODELS/StatUses/Punishments');
const low = require('lowdb');
const { MessageEmbed } = require('discord.js');

class GuildBanAdd {
    constructor(client) {
        this.client = client;
    };

    async run(guild, user) {
        const client = this.client;
        if (guild.id !== client.config.server) return;
        const entry = await guild.fetchAuditLogs({ type: 'MEMBER_BAN_ADD' }).then(logs => logs.entries.first());
        const utils = await low(client.adapters('utils'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        if (entry.createdTimestamp <= Date.now() - 5000) return;
        if (entry.executor.id === client.user.id) return;
        if (entry.executor.bot) return;
        const permission = await Permissions.findOne({ user: entry.executor.id, type: "ban", effect: "member" });
        if ((permission && (permission.count > 0)) || utils.get("root").value().includes(entry.executor.id) || guild.members.cache.get(entry.executor.id).roles.cache.has('718754751893733416')) {
            if (permission) await Permissions.updateOne({ user: entry.executor.id, type: "ban", effect: "member" }, { $inc: { count: -1 } });
            const peer = {
                reason: entry.reeason ? entry.reason : "Belirtilmemiş",
                executor: entry.executor.id,
                type: "PermaBan",
                created: new Date()
            };
            const records = await Punishments.findOne({ _id: user.id });
            if (!records) {
                const record = new Punishments({ _id: user.id, records: [] });
                await record.save();
            }
            await Punishments.updateOne({ _id: user.id }, { $push: { records: peer } });
            return guild.channels.cache.get(channels.get("guard").value()).send(new MessageEmbed().setDescription(`${emojis.get("ban").value()} ${entry.executor} ${user.username} isimli kullanıcıyı banladı. Kalan izin sayısı ${permission.count - 1}`));
        }
        if (permission) await Permissions.deleteOne({ user: entry.executor.id, type: "ban", effect: "member" });
        await guild.members.unban(user.id, "Sağ Tık Ban");
        const exeMember = guild.members.cache.get(entry.executor.id);
        client.extention.emit('Jail', exeMember, client.user.id, "KDE - Sağ Tık Ban", "Perma", 0);
        await emoji.guild.channels.cache.get(channels.get("kde").value()).send(new MessageEmbed().setDescription(`${emojis.get("ban").value()} ${entry.executor} ${user.username} isimli kullanıcıyı banladığı için PermaJail uygulandı.`));

    }
}

module.exports = GuildBanAdd;