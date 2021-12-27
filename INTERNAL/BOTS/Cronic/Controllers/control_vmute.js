const low = require('lowdb')
const model = require('../../../MODELS/Moderation/VoiceMuted');
const { checkMins } = require('../../../HELPERS/functions');
module.exports = class {

    constructor(client) {
        this.client = client
    }

    async run(client) {
        client = this.client;
        const guild = client.guilds.cache.get(client.config.server);
        const asd = await model.find();
        asd.forEach(async doc => {
            if (checkMins(doc.created) >= doc.duration) {
                if (guild.members.cache.get(doc._id) && guild.members.cache.get(doc._id).voice.channel) await guild.members.cache.get(doc._id).voice.setMute(false);
                await model.deleteOne({ _id: doc._id });
                await guild.channels.cache.get(channels.get("modlogs").value()).send(new MessageEmbed().setDescription(`${emojis.get("end-vmute").value()} ${guild.members.cache.get(doc._id) || "bilinmeyen"} kullanıcısının Voice-mute verileri başarıyla silindi!`));
            }
        });
        client.logger.log('VMUTE OK');
        setInterval(async () => {
            const asdf = await model.find();
            asdf.forEach(async doc => {
                if (checkMins(doc.created) >= doc.duration) {
                    if (guild.members.cache.get(doc._id) && guild.members.cache.get(doc._id).voice.channel) await guild.members.cache.get(doc._id).voice.setMute(false);
                    await model.deleteOne({ _id: doc._id });
                    await guild.channels.cache.get(channels.get("modlogs").value()).send(new MessageEmbed().setDescription(`${emojis.get("end-vmute").value()} ${guild.members.cache.get(doc._id) || "bilinmeyen"} kullanıcısının Voice-mute verileri başarıyla silindi!`));
                }
            })
            client.logger.log('VMUTE OK');
        }, 1000 * 60);
    }
}