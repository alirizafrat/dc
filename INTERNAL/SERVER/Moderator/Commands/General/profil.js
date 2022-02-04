const Discord = require('discord.js');
const Command = require("../../Base/Command");
const low = require('lowdb');
const { stripIndent } = require('common-tags');
const { rain, checkDays } = require('../../../../HELPERS/functions');
class Anonim extends Command {

    constructor(client) {
        super(client, {
            name: "profil",
            description: "Kişinin kullanıcı bilgilerini gösterir",
            usage: "profil @etiket/id",
            examples: ["profil 674565119161794560"],
            cooldown: 300000
        });
    }

    async run(client, message, args, data) {
        client = this.client;
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const embed = new Discord.MessageEmbed().setColor('#2f3136');
        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        if (!mentioned) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("kullaniciyok").value()} Kullanıcı bulunamadı!`).setColor('#2f3136'));
        const embedd = new Discord.MessageEmbed().setDescription(stripIndent`
        **${mentioned.displayName}** Kullanıcısının bilgileri:
        \`Katılma Tarihi:\` ${rain(client, checkDays(mentioned.joinedAt))} **Gün Önce**
        \`Oluşturma Tarihi:\` ${rain(client, checkDays(mentioned.user.createdAt))} **Gün Önce**
        \`Ayırıcı Rolü:\` ${mentioned.roles.cache.array().filter(r => r.hoist).sort((a, b) => b.rawPosition - a.rawPosition)[0]}
        \`Durumu:\` ${mentioned.user.presence.activities.find(a => a.type === "CUSTOM_STATUS") ? mentioned.user.presence.activities.find(a => a.type === "CUSTOM_STATUS").state : "Bulunamadı"}
        `).setThumbnail(mentioned.user.displayAvatarURL()).setColor(mentioned.displayHexColor).setTitle("V I E T N A M");
        await message.channel.send(embedd);
    }
}

module.exports = Anonim;