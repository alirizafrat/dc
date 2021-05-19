const low = require('lowdb');
const { MessageEmbed } = require('discord.js');

class MessageDelete {
    constructor(client) {
        this.client = client;
    };
    async run(old, cur) {
        const client = this.client;
        if (cur.guild.id !== client.config.server) return;
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        if (cur.channel.id === old.channel.id) return;
        await cur.guild.channels.cache.get(channels.get("voicelog").value()).send(new MessageEmbed().setDescription(`${emojis.get("key").value()} ${cur.member} kullanıcısını kanal değiştirdi`).addField("Eski Kanal", old.channel || "Yok", false).addField("Yeni Kanal", cur.channel || "Yok", false));
    }
}
module.exports = MessageDelete;