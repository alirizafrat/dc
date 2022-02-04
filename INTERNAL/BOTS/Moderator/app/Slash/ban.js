const { ApplicationCommand } = require('discord.js');

module.exports = class SlashBan extends ApplicationCommand {
    constructor(client) {
        super(client, {
            name: "ban",
            description: "Kullanıcıyı sunucudan süreli veya süresiz banlar",
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
                    description: "Banlanma sebebi",
                    required: true,
                },
                {
                    type: "NUMBER",
                    name: "süre",
                    description: "Gün sayısı",
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