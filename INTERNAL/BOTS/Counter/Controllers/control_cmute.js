const low = require('lowdb')
const model = require('../../../MODELS/Moderation/ChatMuted');
const { checkMins } = require('../../../HELPERS/functions');
const { MessageEmbed } = require('discord.js');
module.exports = class {
    constructor(client) {
        this.client = client
    }
    async run(client) {
        client = this.client
        const roles = await low(client.adapters('roles'));
        const channels = await low(client.adapters('channels'));
        const emojis = await low(client.adapters('emojis'));
        const guild = client.guilds.cache.get(client.config.server);
        const asd = await model.find();
        asd.forEach(async doc => {
            if (checkMins(doc.created) >= doc.duration) {
                if (guild.members.cache.get(doc._id)) await guild.members.cache.get(doc._id).roles.remove(roles.get("muted").value());
                await model.deleteOne({ _id: doc._id });
                await guild.channels.cache.get(channels.get("modlogs").value()).send(new MessageEmbed().setDescription(`${emojis.get("end-cmute").value()} ${guild.members.cache.get(doc._id) || "bilinmeyen"} kullanıcısının Chat-mute verileri başarıyla silindi!`));
            }
        });
        client.logger.log('CMUTE OK');
        setInterval(async () => {
            const asdf = await model.find();
            asdf.forEach(async doc => {
                if (checkMins(doc.created) >= doc.duration) {
                    if (guild.members.cache.get(doc._id)) await guild.members.cache.get(doc._id).roles.remove(roles.get("muted").value());
                    await model.deleteOne({ _id: doc._id });
                    await guild.channels.cache.get(channels.get("modlogs").value()).send(new MessageEmbed().setDescription(`${emojis.get("end-cmute").value()} ${guild.members.cache.get(doc._id) || "bilinmeyen"} kullanıcısının Chat-mute verileri başarıyla silindi!`));
                }
            })
            client.logger.log('CMUTE OK');
        }, 1000 * 60);
    }
}