const Discord = require('discord.js');
const Command = require("../../Base/Command");
const afkdata = require('../../../../MODELS/Temprorary/AfkData');
const low = require('lowdb');
class Call extends Command {

    constructor(client) {
        super(client, {
            name: "afk",
            description: "Belirtilen sebepte sizi afk olarak veritabanına ekler",
            usage: "afk sebep",
            examples: ["afk cumaya gittim geleceğim"],
            category: "Genel",
            aliases: [],
            cmdChannel: "bot-komut",
            cooldown: 300000
        });
    }

    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const sebep = args.join(' ');
        if (!sebep) return message.channel.send(new Discord.MessageEmbed().setColor('#2f3136').setDescription(`${emojis.get("warn").value()} Geçerli bir sebep girmedin!`));
        const system = await afkdata.findOne({ _id: message.member.user.id });
        if (!system) {
            try {
                let sex = new afkdata({
                    _id: message.member.user.id,
                    reason: sebep,
                    created: new Date(),
                    inbox: []
                });
                await sex.save();
            } catch (error) {
                console.log(error);
            }
            await message.channel.send(new Discord.MessageEmbed().setColor('#2f3136').setDescription(`${emojis.get("docs").value()} Başarıyla Ayarlandı!`));
        } else return;
    }
}

module.exports = Call;