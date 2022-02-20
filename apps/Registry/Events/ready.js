const low = require('lowdb');
const wait = require('util').promisify(setTimeout);
class Ready {

    constructor(client) {
        this.client = client;
    }

    async run(client) {
        client.logger.log(`${client.user.tag}, ${client.users.cache.size} kişi için hizmet vermeye hazır!`, "ready");
        client.user.setPresence({ activity: client.config.status, status: "idle" });
        //client = this.client.handler.hello(client);
        const utiller = await low(this.client.adapters('utils'));
        client.invites = await client.guild.invites.fetch();
        if (client.guild.vanityURLCode) {
            await client.guild.fetchVanityData().then(async (res) => {
                utiller.update("vanityUses", n => res.uses).write();
                console.log(res.uses);
            }).catch(console.error);
        }
        let adays = client.guild.members;
        await adays.cache.forEach(async (mem) => {
            let system = await client.models.members.findOne({ _id: mem.user.id });
            if (!system) {
                try {
                    await client.models.members.create({ _id: mem.user.id, roles: mem.roles.cache.map(r => r.name) });
                    this.client.logger.log(` [KİTAPLIĞA EKLENDİ] : ${mem.user.username}`, "mngdb");
                } catch (error) {
                    throw error;
                }
            }
        });
        await this.client.logger.log(` [KAYITLAR TAMAMLANDI] `, "mngdb");
    }
}
module.exports = Ready;