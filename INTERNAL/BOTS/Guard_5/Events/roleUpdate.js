const Permissions = require("../../../MODELS/Temprorary/Permissions");
const Roles = require("../../../MODELS/Datalake/Roles");
const low = require('lowdb');
const { closeall } = require("../../../HELPERS/functions");
const MemberRoles = require('../../../MODELS/Datalake/MemberRoles');
const Discord = require('discord.js');
class RoleUpdate {
    constructor(client) {
        this.client = client;
    };
    async run(oldRole, curRole) {
        const client = this.client;
        if (curRole.guild.id !== client.config.server) return;
        const entry = await curRole.guild.fetchAuditLogs({ type: 'ROLE_UPDATE' }).then(logs => logs.entries.first());
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        if (entry.createdTimestamp <= Date.now() - 5000) return;
        if (entry.executor.id === client.user.id) return;
        const permission = await Permissions.findOne({ user: entry.executor.id, type: "update", effect: "role" });
        if ((permission && (permission.count > 0)) || utils.get("root").value().includes(entry.executor.id)) {
            if (permission) await Permissions.updateOne({ user: entry.executor.id, type: "update", effect: "role" }, { $inc: { count: -1 } });
            await Roles.updateOne({ _id: curRole.id }, {
                name: curRole.name,
                color: curRole.hexColor,
                hoist: curRole.hoist,
                mentionable: curRole.mentionable,
                rawPosition: curRole.rawPosition,
                bitfield: curRole.permissions.bitfield
            });
            if (oldRole.name !== curRole.name) {
                await MemberRoles.updateMany({ roles: oldRole.name }, { $push: { roles: curRole.name } });
                await MemberRoles.updateMany({ roles: oldRole.name }, { $pull: { roles: oldRole.name } });
            }
            return curRole.guild.channels.cache.get(channels.get("grd-rol").value()).send(`${emojis.get("rol").value()} ${entry.executor} ${oldRole.name} isimli rolü düzenledi. Kalan izin sayısı ${permission ? permission.count - 1 : "yok"}`);
        }
        await closeall(curRole.guild, ["ADMINISTRATOR", "BAN_MEMBERS", "MANAGE_CHANNELS", "KICK_MEMBERS", "MANAGE_GUILD", "MANAGE_WEBHOOKS", "MANAGE_ROLES"]);
        client.extention.emit('Ban', curRole.guild, entry.executor, client.user.id, "KDE - Rol Güncelleme", "Perma", 0);
        await Permissions.deleteOne({ user: entry.executor.id, type: "update", effect: "role" });
        const data = await Roles.findOne({ _id: curRole.id });
        await curRole.edit({
            name: data.name,
            color: data.hexColor,
            hoist: data.hoist,
            mentionable: data.mentionable,
            position: data.rawPosition,
            permissions: new Discord.Permissions(data.bitfield)
        });
        await curRole.guild.channels.cache.get(channels.get("kde").value()).send(new Discord.MessageEmbed().setDescription(`${emojis.get("rol").value()} ${entry.executor} ${oldRole.name} isimli rolü düzenledi. Kalan izin sayısı ${permission ? permission.count - 1 : "yok"}`));

    }
}
module.exports = RoleUpdate;