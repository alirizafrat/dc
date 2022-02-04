const { ApplicationCommand } = require('discord.js');

module.exports = class SlashMute extends ApplicationCommand {
    constructor(client) {
        super(client, {
            name: "jail",
            description: "Kullanıcıyı cezalıya atar",
            options: [
                {
                    type: "USER",
                    name: "kullanıcı",
                    description: "Banlanacak kullanıcı/id",
                    required: true,
                },
                {
                    type: "STRING",
                    name: "tür",
                    description: "mute türü",
                    choices: [
                        {
                            name: "chat mute",
                            value: "chat"
                        },
                        {
                            name: "voice mute",
                            value: "voice"
                        }
                    ],
                    required: true,
                },
                {
                    type: "NUMBER",
                    name: "süre",
                    description: "dakika sayısı",
                    required: true,
                },
                {
                    type: "STRING",
                    name: "sebep",
                    description: "Ceza sebebi",
                    required: true,
                },
                {
                    type: "STRING",
                    name: "not",
                    description: "Ceza notu",
                    required: false,
                }
            ]
        }, client.guild, client.guild.id);
        this.init();
    }
    run() {

    }
    init() {

    }
}