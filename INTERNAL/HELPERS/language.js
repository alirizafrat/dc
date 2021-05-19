const Discord = require('discord.js');
class Language {
    constructor() {
        this.warnings = {
            pj: (user, objectname, type, effect) => `**${user}** kullanıcısı **${objectname}** isimli ${type} ${effect} çalıştığı için permajail uygulandı!`
        }
    }
    static entrylog(entry, object) {
        const embed = new Discord.MessageEmbed().setColor('RED');
        let effection;
        switch (entry.actionType) {
            case ("CREATE"):
                effection = "oluşturmaya";
                break;
            case ("DELETE"):
                effection = "silmeye";
                break;
            case ("UPDATE"):
                effection = "yenilemeye";
                break;
            default:
                efection = "bilinmiyor";
                break;
        }
        return embed.setDescription(`${entry.executor} ${entry.target.naem} isimli ${object} ${effection} çalıştığı için PermaJail uygulandı!`);


    }
}
module.exports = Language;