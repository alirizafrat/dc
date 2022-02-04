module.exports = class {
    constructor(client) {
        this.client = client;
    }
    async run(interaction) {
        const client = this.client;
        if (message.guild && (message.guild.id !== client.config.server)) return;
        let cmd = `Message:${interaction.name}`;
        if (client.responders.has(cmd)) {
            cmd = client.responders.get(cmd);
        } else return;

    }
}