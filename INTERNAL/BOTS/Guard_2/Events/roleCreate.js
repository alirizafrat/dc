const Permissions = require("../../../MODELS/Temprorary/Permissions");
const Roles = require("../../../MODELS/Datalake/Roles");
const low = require('lowdb');
const { closeall } = require("../../../HELPERS/functions");
const { MessageEmbed } = require('discord.js');
class RoleCreate {
    constructor(client) {
        this.client = client;
    };
    async run(role) {
        const client = this.client;
        if (role.guild.id !== client.config.server) return;
        const entry = await role.guild.fetchAuditLogs({ type: 'ROLE_CREATE' }).then(logs => logs.entries.first());
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        if (entry.createdTimestamp <= Date.now() - 5000) return;
        if (entry.executor.id === client.user.id) return;
        const permission = await Permissions.findOne({ user: entry.executor.id, type: "create", effect: "role" });
        if ((permission && (permission.count > 0)) || utils.get("root").value().includes(entry.executor.id)) {
            if (permission) await Permissions.updateOne({ user: entry.executor.id, type: "create", effect: "role" }, { $inc: { count: -1 } });
            const newData = new Roles({
                _id: role.id,
                name: role.name,
                color: role.hexColor,
                hoist: role.hoist,
                mentionable: role.mentionable,
                rawPosition: role.rawPosition,
                bitfield: role.permissions.bitfield
            });
            await newData.save();
            return role.guild.channels.cache.get(channels.get("backup").value()).send(new MessageEmbed().setDescription(`${emojis.get("rol").value()} ${entry.executor} ${role.name} isimli rolü açtı. Kalan izin sayısı ${permission ? permission.count - 1 : "yok"}`));
        }
        if (permission) await Permissions.deleteOne({ user: entry.executor.id, type: "create", effect: "role" });
        await closeall(role.guild, ["ADMINISTRATOR", "BAN_MEMBERS", "MANAGE_CHANNELS", "KICK_MEMBERS", "MANAGE_GUILD", "MANAGE_WEBHOOKS", "MANAGE_ROLES"]);
        await role.delete();
        const exeMember = role.guild.members.cache.get(entry.executor.id);
        client.extention.emit('Jail', exeMember, client.user.id, "KDE - Rol Oluşturma", "Perma", 0);
        await role.guild.channels.cache.get(new MessageEmbed().setDescription(`${emojis.get("kde").value()} ${entry.executor} ${role.name} isimli rolü açtı.`));
    }
}

module.exports = RoleCreate;