const Permissions = require("../../../../MODELS/Temprorary/Permissions");
const low = require('lowdb');
const { closeall } = require("../../../../HELPERS/functions");
const Discord = require('discord.js');
const overwrites = require("../../../../MODELS/Datalake/Overwrites");

class ChannelUpdate {
    constructor(client) {
        this.client = client;
    };

    async run(oldChannel, curChannel) {
        const client = this.client;
        if (curChannel.guild.id !== client.config.server) return;
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const entry = await curChannel.guild.fetchAuditLogs({ type: "CHANNEL_OVERWRITE_UPDATE" }).then(logs => logs.entries.first());
        if (entry.createdTimestamp <= Date.now() - 1000) return;
        if (entry.executor.id === client.user.id) return;
        if (entry.target.id !== curChannel.id) return;
        const permission = await Permissions.findOne({ user: entry.executor.id, type: "overwrite", effect: "channel" });
        if ((permission && (permission.count > 0)) || utils.get("root").value().includes(entry.executor.id)) {
            if (permission) await Permissions.updateOne({
                user: entry.executor.id,
                type: "overwrite",
                effect: "channel"
            }, { $inc: { count: -1 } });
            const document = await overwrites.findOne({ _id: curChannel.id });
            if (!document) {
                const newData = new overwrites({ _id: curChannel.id, overwrites: [] });
                await newData.save();
            } else {
                await overwrites.updateOne({ _id: curChannel.id }, { $pullAll: { overwrites: document.overwrites } });
            }
            await overwrites.updateOne({ _id: curChannel.id }, { overwrites: curChannel.permissionOverwrites.array() });
            return curChannel.guild.channels.cache.get(channels.get("guard").value()).send(`${emojis.get("izin").value()} ${entry.executor} ${curChannel.name} isimli kanalda izin yeniledi. Kalan izin sayısı ${permission ? permission.count - 1 : "yok"}`);
        }
        await Permissions.deleteOne({ user: entry.executor.id, type: "overwrite", effect: "channel" });
        await closeall(curChannel.guild, ["ADMINISTRATOR", "BAN_MEMBERS", "MANAGE_CHANNELS", "KICK_MEMBERS", "MANAGE_GUILD", "MANAGE_WEBHOOKS", "MANAGE_ROLES"]);
        const overwrits = await overwrites.findOne({ _id: curChannel.id });
        const options = [];
        for (let index = 0; index < overwrits.overwrites.length; index++) {
            const data = overwrits.overwrites[index];
            options.push({
                id: data.id,
                allow: new Discord.Permissions(data.allow.bitfield).toArray(),
                deny: new Discord.Permissions(data.deny.bitfield).toArray()
            });
        }
        await curChannel.overwritePermissions(options);
        const exeMember = curChannel.guild.members.cache.get(entry.executor.id);
        client.extention.emit('PermaJail', exeMember, client.user.id, "KDE - İzin Yenileme", "Perma", 0);
        await role.guild.channels.cache.get(channels.get("kde").value()).send(`${emojis.get("izin").value()} ${entry.executor} ${curChannel.name} isimli kanalda izin yeniledi.`);
    }
}

module.exports = ChannelUpdate;