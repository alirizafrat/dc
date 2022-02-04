const { ApplicationCommand } = require('discord.js');

module.exports = class SlashJail extends ApplicationCommand {
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
                    name: "sebep",
                    description: "Jail sebebi",
                    required: true,
                },
                {
                    type: "NUMBER",
                    name: "süre",
                    description: "Saat sayısı",
                    required: false,
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