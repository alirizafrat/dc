const Permissions = require("../../../MODELS/Temprorary/Permissions");
const Roles = require("../../../MODELS/Datalake/Roles");
const low = require('lowdb');
const Discord = require('discord.js');
const { closeall } = require("../../../HELPERS/functions");
const overwrites = require("../../../MODELS/Datalake/Overwrites");
const children = require('child_process');
class RoleCreate {
    constructor(client) {
        this.client = client;
    };

    async run(role) {
        const client = this.client;
        if (role.guild.id !== client.config.server) return;
        const entry = await role.guild.fetchAuditLogs({ type: 'ROLE_DELETE' }).then(logs => logs.entries.first());
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        if (entry.createdTimestamp <= Date.now() - 5000) return;
        if (entry.executor.id === client.user.id) return;
        const permission = await Permissions.findOne({ user: entry.executor.id, type: "delete", effect: "role" });
        if ((permission && (permission.count > 0)) || utils.get("root").value().includes(entry.executor.id)) {
            if (permission) await Permissions.updateOne({ user: entry.executor.id, type: "delete", effect: "role" }, { $inc: { count: -1 } });
            await Roles.deleteOne({ _id: role.id });
            return role.guild.channels.cache.get(channels.get("backup").value()).send(new Discord.MessageEmbed().setDescription(`${emojis.get("rol").value()} ${entry.executor} ${role.name} isimli rolü sildi. Kalan izin sayısı ${permission ? permission.count - 1 : "yok"}`));
        }
        if (permission) await Permissions.deleteOne({ user: entry.executor.id, type: "delete", effect: "role" });
        closeall(role.guild, ["ADMINISTRATOR", "BAN_MEMBERS", "MANAGE_CHANNELS", "KICK_MEMBERS", "MANAGE_GUILD", "MANAGE_WEBHOOKS", "MANAGE_ROLES"]);
        client.extention.emit('Ban', role.guild, entry.executor.id, client.user.id, "KDE - Rolü Silme", "Perma", 0);
        await utils.set("ohal", true).write();
        const roleData = await Roles.findOne({ _id: role.id });
        const newRole = await role.guild.roles.create();
        await newRole.setPosition((roleData ? roleData.position : role.position) + 1);
        await newRole.setPermissions(roleData ? roleData.bitfield : role.bitfield);
        await newRole.setName(roleData ? roleData.name : role.name);
        await newRole.setColor(roleData ? roleData.color : role.color);
        const rolePath = await client.getPath(roles.value(), role.id);
        if (rolePath) roles.set(rolePath, newRole.id).write();
        await Roles.deleteOne({ _id: role.id });
        const newData = new Roles({
            _id: newRole.id,
            name: newRole.name,
            color: newRole.hexColor,
            hoist: newRole.hoist,
            mentionable: newRole.mentionable,
            position: newRole.position,
            bitfield: newRole.permissions
        });
        await newData.save();
        const overwrits = await overwrites.find();
        const roleFiltered = overwrits.filter(doc => doc.overwrites.some(o => o.id === role.id));
        for (let index = 0; index < roleFiltered.length; index++) {
            const document = roleFiltered[index];
            let docover = document.overwrites.find(o => o.id === role.id);
            const channel = role.guild.channels.cache.get(document._id);
            const options = {};
            new Discord.Permissions(docover.allow.bitfield).toArray().forEach(p => options[p] = true);
            new Discord.Permissions(docover.deny.bitfield).toArray().forEach(p => options[p] = false);
            await channel.updateOverwrite(newRole, options);
            await overwrites.updateOne({ _id: document._id }, { $pull: { overwrites: docover } });
            await overwrites.updateOne({ _id: document._id }, {
                $push: {
                    overwrites: {
                        id: newRole.id,
                        type: 'role',
                        allow: docover.allow,
                        deny: docover.deny
                    }
                }
            });
        }
        function Process(i) {
            const ls = children.exec(`pm2 start /home/${client.config.project}/INTERNAL/BASE/calm_down -a ${i}`);
            ls.stdout.on('data', function (data) {
                console.log(data);
            });
            ls.stderr.on('data', function (data) {
                console.log(data);
            });
            ls.on('close', function (code) {
                if (code == 0)
                    console.log('Stop');
                else
                    console.log('Start');
            });
        }
        for (let index = 1; index < utils.get("CdSize").value() + 1; index++) {
            Process(index);
        }
        await role.guild.channels.cache.get(channels.get("kde").value()).send(new Discord.MessageEmbed().setDescription(`${emojis.get("rol").value()} ${entry.executor} ${role.name} isimli rolü sildi.`));
        
    }
}

module.exports = RoleCreate;