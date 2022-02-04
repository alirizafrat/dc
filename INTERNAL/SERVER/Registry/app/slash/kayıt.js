const { SlashCommandBuilder } = require('@discordjs/builders');
class Kayıt {
    constructor(client) {
        super(client, {
            name: "ban",
            description: "Belirtilen kullanıcıyı banlar",
            type: 1,
            options: [
                
            ],
            category: "Moderasyon",
            aliases: ["yargı", "infaz"],
            accaptedPerms: ["cmd-ban", "cmd-all"],
            cooldown: 10000
        })
    }
}