const Permissions = require('../../../MODELS/Temprorary/Permissions');
const low = require('lowdb');
const { MessageEmbed } = require('discord.js');

class EmojiDelete {
    constructor(client) {
        this.client = client;
    };

    async run(emoji) {
        const client = this.client;
        if (emoji.guild.id !== client.config.server) return;
        const entry = await emoji.guild.fetchAuditLogs({ type: 'EMOJI_DELETE' }).then(logs => logs.entries.first());
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        if (entry.createdTimestamp <= Date.now() - 5000) return;
        if (entry.executor.id === client.user.id) return;
        const permission = await Permissions.findOne({ user: entry.executor.id, type: "delete", effect: "emoji" });
        if ((permission && (permission.count > 0)) || utils.get("root").value().includes(entry.executor.id)) {
            if (permission) await Permissions.updateOne({
                user: entry.executor.id,
                type: "delete",
                effect: "emoji"
            }, { $inc: { count: -1 } });
            return emoji.guild.channels.cache.get(channels.get("guard").value()).send(new MessageEmbed().setDescription(`${emojis.get("emoji").value()} ${entry.executor} ${emoji.name} isimli emojiyi sildi. Kalan izin sayısı ${permission.count - 1}`));
        }
        if (permission) await Permissions.deleteOne({ user: entry.executor.id, type: "delete", effect: "emoji" });
        await emoji.guild.emojis.create(emoji.url, emoji.name, {
            reason: `${entry.executor.username} tarafından silinmiştir.`,
            roles: emoji.roles
        });
        const exeMember = emoji.guild.members.cache.get(entry.executor.id);
        client.extention.emit('Jail', exeMember, client.user.id, "KDE - Emoji Delete", "Perma", 0);
        await emoji.guild.channels.cache.get(channels.get("kde").value()).send(new MessageEmbed().setDescription(`${emojis.get("emoji").value()} ${entry.executor} ${emoji.name} isimli emojiyi sildiği için PermaJail uygulandı.`));

    }
}

module.exports = EmojiDelete;