const Permissions = require("../../../MODELS/Temprorary/Permissions");
const low = require('lowdb');
const { closeall } = require("../../../HELPERS/functions");
const TextChannels = require("../../../MODELS/Datalake/TextChannels");
const VoiceChannels = require('../../../MODELS/Datalake/VoiceChannels');
const CatChannels = require('../../../MODELS/Datalake/CatChannels');
const { MessageEmbed } = require('discord.js');
class ChannnelCreate {
    constructor(client) {
        this.client = client;
    }
    async run(channel) {
        const client = this.client;
        if (channel.guild.id !== client.config.server) return;
        const utils = await low(client.adapters('utils'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const entry = await channel.guild.fetchAuditLogs({ type: "CHANNEL_CREATE" }).then(logs => logs.entries.first());
        if (entry.createdTimestamp <= Date.now() - 5000) return;
        if (entry.executor.id === client.user.id) return;
        const permission = await Permissions.findOne({ user: entry.executor.id, type: "create", effect: "channel" });
        if ((permission && (permission.count > 0)) || utils.get("root").value().includes(entry.executor.id)) {
            if (permission) await Permissions.updateOne({ user: entry.executor.id, type: "create", effect: "channel" }, { $inc: { count: -1 } });
            if ((channel.type === 'text') && (channel.type === 'news')) {
                const begon = new TextChannels({
                    _id: channel.id,
                    name: channel.name,
                    nsfw: channel.nsfw,
                    parentID: channel.parentID,
                    position: channel.position,
                    rateLimit: channel.rateLimitPerUser
                });
                await begon.save();
                await channel.guild.channels.cache.get(channels.get("backup").value()).send(new MessageEmbed().setDescription(`${emojis.get("mongo").value()} **${channel.name}** kanalının verileri oluşturuldu..`));
            }
            if (channel.type === 'voice') {
                const begon = new VoiceChannels({
                    _id: channel.id,
                    name: channel.name,
                    bitrate: channel.bitrate,
                    parentID: channel.parentID,
                    position: channel.position
                });
                await begon.save();
                await channel.guild.channels.cache.get(channels.get("backup").value()).send(new MessageEmbed().setDescription(`${emojis.get("mongo").value()} **${channel.name}** kanalının verileri oluşturuldu..`));
            }
            if (channel.type === 'category') {
                const begon = new CatChannels({
                    _id: channel.id,
                    name: channel.name,
                    position: channel.position
                });
                await begon.save();
                await channel.guild.channels.cache.get(channels.get("backup").value()).send(new MessageEmbed().setDescription(`${emojis.get("mongo").value()} **${channel.name}** kategorisinin verileri oluşturuldu..`));
            }
            return channel.guild.channels.cache.get(channels.get("backup").value()).send(new MessageEmbed().setDescription(`${emojis.get("kanal").value()} ${entry.executor} ${channel.name} isimli kanalı açtı. Kalan izin sayısı ${permission ? permission.count - 1 : "yok"}`));
        }
        if (permission) await Permissions.deleteOne({ user: entry.executor.id, type: "create", effect: "channel" });
        await closeall(channel.guild, ["ADMINISTRATOR", "BAN_MEMBERS", "MANAGE_CHANNELS", "KICK_MEMBERS", "MANAGE_GUILD", "MANAGE_WEBHOOKS", "MANAGE_ROLES"]);
        await channel.delete(`${entry.executor.username} Tarafından oluşturulmaya çalışıldı`);
        const exeMember = channel.guild.members.cache.get(entry.executor.id);
        client.extention.emit('Jail', exeMember, client.user.id, "KDE - Kanal Oluşturma", "Perma", 0);
        await channel.guild.channels.cache.get(channels.get("kde").value()).send(new MessageEmbed().setDescription(`${emojis.get("kanal").value()} ${entry.executor} ${channel.name} isimli kanalı açtığı için **Jail** uygulandı.`).setColor('RED'));
    }
}
module.exports = ChannnelCreate;