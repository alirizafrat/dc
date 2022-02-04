const models = require('../../../MODELS/Datalake/MemberRoles');
const cmutes = require('../../../MODELS/Moderation/ChatMuted');
const pJails = require('../../../MODELS/Moderation/Jails');
const low = require("lowdb");
const Discord = require('discord.js');
class GuildMemberUpdate {
    constructor(client) {
        this.client = client;
    };

    async run(prev, cur) {
        const client = this.client;
        if (cur.guild.id !== client.config.server) return;
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const embed = new Discord.MessageEmbed().setColor("#2f3136").setTimestamp().setAuthor(`Hepinizi Seviyorum 💖 Tantoony`, client.owner.displayAvatarURL());
        if (prev && prev.roles.cache.has(roles.get("booster").value()) && !cur.roles.cache.has(roles.get("booster").value())) {
            let nameDB = await names.findOne({ _id: cur.user.id });
            if (!nameDB) {
                await cur.roles.remove(cur.roles.cache.array());
                await cur.roles.add(roles.get("welcome").value());
            } else {
                let pointed = '•';
                if (cur.user.username.includes(client.config.tag)) {
                    pointed = client.config.tag;
                };
                await cur.setNickname(`${pointed} ${nameDB.name}`);
            };
        };
        const entry = await cur.guild.fetchAuditLogs({ type: "MEMBER_ROLE_UPDATE" }).then(logs => logs.entries.first());
        if (entry.createdTimestamp <= Date.now() - 5000) return;
        let roleNames = await cur.roles.cache.map(role => role.name);
        if (!utils.get("ohal").value()) {
            const model = await models.findOne({ _id: cur.user.id });
            if (!model) {
                let saver = new models({ _id: cur.user.id, roles: roleNames });
                await saver.save();
            } else {
                await models.updateOne({ _id: cur.user.id }, { $set: { roles: roleNames } });
                client.logger.log(`${entry.executor.username} => [${entry.changes[0].key}] ${entry.target.username} : ${entry.changes[0].new[0].name}`, "mngdb");
            }
        }
        const cmute = await cmutes.findOne({ _id: cur.user.id });
        if (cmute && !cur.roles.cache.has(roles.get("muted").value()) && !entry.executor.bot) {
            await cur.roles.add(roles.get("muted").value());
            const exeMember = cur.guild.members.cache.get(entry.executor.id);
            if (exeMember.roles.cache.has(roles.get("root").value()) || utils.get("root").value().includes(entry.executor.id)) return;
            client.extention.emit("Jail", exeMember, this.client.user.id, "KDE - Mute Açma", "Perma", 1);
            await cur.guild.channels.cache.get(channels.get("backup").value()).send(embed.setDescription(`${emojis.get("role").value()} ${exeMember} Adlı Kullanıcı ${cur} Adlı Kullanıcının Mutesini Açmaya Çalıştı Gerekeni Yaptım`));
        };
        const pJail = await pJails.findOne({ _id: cur.user.id });
        if (pJail && !entry.executor.bot) {
            await cur.roles.remove(cur.roles.cache.filter(r => r.id !== roles.get("booster").value()).filter(r => r.editable).array());
            await cur.roles.add(roles.get("prisoner").value());
            const exeMember = cur.guild.members.cache.get(entry.executor.id);
            if (exeMember.roles.cache.has(roles.get("root").value()) || utils.get("root").value().includes(entry.executor.id)) return;
            client.extention.emit("Jail", exeMember, this.client.user.id, "KDE - Jail Açma", "Perma", 1);
            await cur.guild.channels.cache.get(channels.get("backup").value()).send(embed.setDescription(`${emojis.get("role").value()} ${exeMember} Adlı Kullanıcı ${cur} Adlı Kullanıcının Jailini Açmaya Çalıştı Gerekeni Yaptım.`));
        };
        const role = cur.guild.roles.cache.get(entry.changes[0].new[0].id);
        const perms = ["ADMINISTRATOR", "KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_CHANNELS", "MANAGE_GUILD", "VIEW_AUDIT_LOG", "MANAGE_MESSAGES", "MENTION_EVERYONE", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS", "MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MANAGE_EMOJIS"];
        if (perms.some(perm => role.permissions.has(perm)) && !utils.get("root").value().includes(entry.executor.id) && !entry.executor.bot) {
            const key = entry.changes[0].key;
            if (key === '$add') await cur.roles.remove(role);
            if (key === '$remove') await cur.roles.add(role);
            const exeMember = cur.guild.members.cache.get(entry.executor.id);
            client.extention.emit("Jail", exeMember, this.client.user.id, "KDE - Rol Verme", "Perma", 1);
            await cur.guild.channels.cache.get(channels.get("backup").value()).send(embed.setDescription(`${emojis.get("role").value()} ${exeMember} Adlı Kullanıcı ${cur} Adlı Kullanıcıya Önemli Bir Rol Verdiği İçin Gerekeni Yaptım.`));
        }

    }
}
module.exports = GuildMemberUpdate;