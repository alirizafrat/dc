const Permissions = require("../../../MODELS/Temprorary/Permissions");
const low = require('lowdb');
const { closeall } = require("../../../HELPERS/functions");
const TextChannels = require("../../../MODELS/Datalake/TextChannels");
const VoiceChannels = require('../../../MODELS/Datalake/VoiceChannels');
const CatChannels = require('../../../MODELS/Datalake/CatChannels');
const Discord = require('discord.js');
class ChannelUpdate {
    constructor(client) {
        this.client = client;
    };
    async run(oldChannel, curChannel) {
        const client = this.client;
        if (curChannel.guild.id !== client.config.server) return;
        const utils = await low(client.adapters('utils'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        let entry = await curChannel.guild.fetchAuditLogs({ type: "CHANNEL_UPDATE" }).then(logs => logs.entries.first());
        if (entry.createdTimestamp <= Date.now() - 5000) return;
        if (entry.executor.id === client.user.id) return;
        const permission = await Permissions.findOne({ user: entry.executor.id, type: "update", effect: "channel" });
        if ((permission && permission.count > 0) || utils.get("root").value().includes(entry.executor.id)) {
            if ((curChannel.type === 'text') || (curChannel.type === 'news')) {
                await TextChannels.updateOne({ _id: oldChannel.id }, {
                    $set: {
                        name: curChannel.name,
                        nsfw: curChannel.nsfw,
                        parentID: curChannel.parentID,
                        position: curChannel.position,
                        rateLimit: curChannel.rateLimitPerUser
                    }
                });
            }
            if (curChannel.type === 'voice') {
                await VoiceChannels.updateOne({ _id: curChannel.id }, {
                    $set: {
                        name: curChannel.name,
                        bitrate: curChannel.bitrate,
                        parentID: curChannel.parentID,
                        position: curChannel.position
                    }
                });
            }
            if (curChannel.type === 'category') {
                await CatChannels.updateOne({ _id: curChannel.id }, {
                    $set: {
                        name: curChannel.name,
                        position: curChannel.position
                    }
                });
            }
            return curChannel.guild.channels.cache.get(channels.get("backup").value()).send(new Discord.MessageEmbed().setColor('#2f3136').setDescription(`${emojis.get("kanal").value()} ${entry.executor} ${curChannel.name} isimli kanalı yeniledi. Kalan izin sayısı ${permission ? permission.count - 1 : "yok"}`));
        }
        await Permissions.deleteOne({ user: entry.executor.id, type: "update", effect: "channel" });
        await closeall(curChannel.guild, ["ADMINISTRATOR", "BAN_MEMBERS", "MANAGE_CHANNELS", "KICK_MEMBERS", "MANAGE_GUILD", "MANAGE_WEBHOOKS", "MANAGE_ROLES"]);
        if ((curChannel.type === 'text') || (curChannel.type === 'news')) {
            const data = await TextChannels.findOne({ _id: oldChannel.id });
            await curChannel.edit({
                name: data.name,
                nsfw: data.nsfw,
                parentID: data.parentID,
                position: data.position,
                rateLimit: data.rateLimit
            });
        }
        if (curChannel.type === 'voice') {
            const data = await VoiceChannels.findOne({ _id: curChannel.id });
            await curChannel.edit({
                name: data.name,
                bitrate: data.bitrate,
                parentID: data.parentID,
                position: data.position
            });
        }
        if (curChannel.type === 'category') {
            const data = await CatChannels.findOne({ _id: curChannel.id });
            await curChannel.edit({
                name: data.name,
                position: data.position
            });
        }
        const exeMember = curChannel.guild.members.cache.get(entry.executor.id);
        client.extention.emit('PermaJail', exeMember, client.user.id, "KDE - Kanal Yenileme", "Perma", 0);
        await curChannel.guild.channels.cache.get(channels.get("kde").value()).send(new Discord.MessageEmbed().setColor('#2f3136').setDescription(`${emojis.get("kanal").value()} ${entry.executor} ${channel.name} isimli kanalı düzenled.`));
    }
}
module.exports = ChannelUpdate;