class InteractionCreate {
    constructor(client) {
        this.client = client;
    }
    async run(interaction) {
        const client = this.client;
        if (interaction.guild && (interaction.guild.id !== client.config.server)) return;
        let respond;
        switch (interraction.type) {
            case "APPLICATION_COMMAND":
                switch (interaction.command.type) {
                    case "CHAT_INPUT":
                        respond = 'aC_clickMsg';
                        break;
                    case "USER":
                        respond = 'aC_clickUsr';
                        break;
                    case "MESSAGE":
                        respond = 'aC_slash';
                        break;
                    default:
                        break;
                }
                break;
            case "MESSAGE_COMPONENT":
                respond = 'aC_button';
                break;
            default:
                break;
        }
        let uCooldown = client.cmdCoodown[interaction.user.id];
        if (!uCooldown) {
            client.cmdCoodown[interaction.author.id] = {};
            uCooldown = client.cmdCoodown[interaction.user.id];
        }
        let time = uCooldown[cmd.info.name] || 0;
        if (time && (time > Date.now())) return;
        client.extention.emit(respond, interaction);
        return;
    }
}

module.exports = InteractionCreate;