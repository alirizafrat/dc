const low = require('lowdb');
class Ready {

    constructor(client) {
        this.client = client;
    }

    async run() {
        const client = this.client;
        const utils = await low(client.adapters('utils'));
        client.guild = client.guilds.cache.get(client.config.server);
        client.logger.log(`${client.user.tag}, ${client.users.cache.size} kişi için hizmet vermeye hazır!`, "ready");
        client.user.setPresence({ activity: client.config.status, status: "idle" });
        client.owner = client.users.cache.get(client.config.owner);
        client.channels.cache.get(utils.get("lastCrush").value()).send("**TEKRAR ONLINE!**");

    }
}
module.exports = Ready;