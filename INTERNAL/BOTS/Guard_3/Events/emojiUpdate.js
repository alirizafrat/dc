const Permissions = require('../../../MODELS/Temprorary/Permissions');
const low = require('lowdb');
const { MessageEmbed } = require('discord.js');

class EmojiUpdate {
    constructor(client) {
        this.client = client;
    };

    async run(oldEmoji, curEmoji) {
        const client = this.client;
        if (curEmoji.guild.id !== client.config.server) return;
        const entry = await curEmoji.guild.fetchAuditLogs({ type: 'EMOJI_UPDATE' }).then(logs => logs.entries.first());
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        if (entry.createdTimestamp <= Date.now() - 5000) return;
        if (entry.executor.id === client.user.id) return;
        const permission = await Permissions.findOne({ user: entry.executor.id, type: "update", effect: "emoji" });
        if ((permission && (permission.count > 0)) || utils.get("root").value().includes(entry.executor.id)) {
            if (permission) await Permissions.updateOne({
                user: entry.executor.id,
                type: "update",
                effect: "emoji"
            }, { $inc: { count: -1 } });
            return curEmoji.guild.channels.cache.get(channels.get("guard").value()).send(new MessageEmbed().setDescription(`${emojis.get("emoji").value()} ${entry.executor} ${oldEmoji.name} isimli emojiyi yeniledi. Kalan izin sayısı ${permission.count - 1}`));
        }
        if (permission) await Permissions.deleteOne({ user: entry.executor.id, type: "update", effect: "emoji" });
        const emoji = await curEmoji.edit({
            name: oldEmoji.name,
            roles: oldEmoji.roles
        }, `${entry.executor.username} Tarafından değiştirilmeye çalışıldı`);
        const exeMember = curEmoji.guild.members.cache.get(entry.executor.id);
        client.extention.emit('PermaJail', exeMember, client.user.id, "KDE - Emoji Yenileme", "Perma", 0);
        await emoji.guild.channels.cache.get(channels.get("kde").value()).send(new MessageEmbed().setDescription(`${emojis.get("emoji").value()} ${entry.executor} ${oldEmoji.name} isimli emojiyi yenilediği için PermaJail uygulandı.`));

    }
}

module.exports = EmojiUpdate;