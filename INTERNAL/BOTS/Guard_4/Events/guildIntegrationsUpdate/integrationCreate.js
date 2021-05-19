const low = require('lowdb');
class IntegrationCreate {
    constructor(client) {
        this.client = client;
    };
    async run(guild) {
        const client = this.client;
        if (guild.id !== client.config.server) return;
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const entry = await guild.fetchAuditLogs({ type: "INTEGRATION_CREATE" }).then(logs => logs.entries.first());
        if (entry.createdTimestamp <= Date.now() - 1000) return;
        if (entry.executor.id === client.user.id) return;
        
    }
}
module.exports = IntegrationCreate;