const low = require('lowdb')
const model = require('../../../MODELS/Moderation/Ban');
const { checkDays } = require('../../../HELPERS/functions');
const { MessageEmbed } = require('discord.js');
module.exports = class {

    constructor(client) {
        this.client = client
    }
    async run(client) {
        client = this.client;
        const channels = await low(client.adapters('channels'));
        const emojis = await low(client.adapters('emojis'));
        const guild = client.guilds.cache.get(client.config.server);
        const asd = await model.find();
        asd.filter(doc => doc.type === "temp").forEach(async doc => {
            if (checkDays(doc.created) >= doc.duration) {
                const ban = await guild.fetchBan(doc._id);
                await guild.members.unban(doc._id);
                await model.deleteOne({ _id: doc._id });
                await guild.channels.cache.get(channels.get('modlogs').value()).send(new MessageEmbed().setColor('RED').setDescription(`${emojis.get("end-ban").value()} **${ban.user.username}** kişisinin **${ban.reason ? ban.reason : "belirtilmemiş"}** sebebiyle atılan banı **${doc.duration}** günün ardından kaldırıldı.`));
            }
        });
        client.logger.log('Banlar OK')
        setInterval(async () => {
            const asdf = await model.find()
            asdf.filter(doc => doc.type === "temp").forEach(async doc => {
                const ban = await guild.fetchBan(doc._id);
                await guild.members.unban(doc._id);
                await model.deleteOne({ _id: doc._id });
                await guild.channels.cache.get(channels.get('modlogs').value()).send(new MessageEmbed().setColor('RED').setDescription(`${emojis.get("end-ban").value()} **${ban.user.username}** kişisinin **${ban.reason ? ban.reason : "belirtilmemiş"}** sebebiyle atılan banı **${doc.duration}** günün ardından kaldırıldı.`));
            })
            client.logger.log('Banlar OK')
        }, 1000 * 60 * 60);
    }
}