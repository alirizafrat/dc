const low = require('lowdb')
const model = require('../../../MODELS/Moderation/Jails');
const { checkDays } = require('../../../HELPERS/functions');
module.exports = class {

    constructor(client) {
        this.client = client
    }

    async run(client) {
        client = this.client;
        const roles = await low(client.adapters('roles'));
        const guild = client.guilds.cache.get(client.config.server);
        const asd = await model.find();
        asd.filter(doc => doc.type === "temp").forEach(async doc => {
            if (checkDays(doc.created) >= doc.duration) {
                if (guild.members.cache.get(doc._id)) {
                    await guild.members.cache.get(doc._id).roles.add(Data.roles.filter(rname => guild.roles.cache.find(r => r.name === rname)).map(rname => guild.roles.cache.find(role => role.name === rname)));
                    await guild.members.cache.get(doc._id).roles.remove(roles.get("prison").value());
                }
                await model.deleteOne({ _id: doc._id })
                await guild.channels.cache.get(channels.get("modlogs").value()).send(new MessageEmbed().setDescription(`${emojis.get("end-jail").value()} ${guild.members.cache.get(doc._id) || "bilinmeyen"} kullanıcısının jail verileri başarıyla silindi!`));
            }
        });
        client.logger.log('JAIL OK');
        setInterval(async () => {
            const asdf = await model.find();
            asdf.filter(doc => doc.type === "temp").forEach(async doc => {
                if (checkDays(doc.created) >= doc.duration) {
                    if (guild.members.cache.get(doc._id)) {
                        await guild.members.cache.get(doc._id).roles.add(Data.roles.filter(rname => guild.roles.cache.find(r => r.name === rname)).map(rname => guild.roles.cache.find(role => role.name === rname)));
                        await guild.members.cache.get(doc._id).roles.remove(roles.get("prison").value());
                    }
                    await model.deleteOne({ _id: doc._id });
                    await guild.channels.cache.get(channels.get("modlogs").value()).send(new MessageEmbed().setDescription(`${emojis.get("end-jail").value()} ${guild.members.cache.get(doc._id) || "bilinmeyen"} kullanıcısının jail verileri başarıyla silindi!`));
                }
            })
            client.logger.log('JAIL OK');
        }, 1000 * 60);
    }
}