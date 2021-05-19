const Discord = require('discord.js');
const Command = require("../../Base/Command");
const low = require('lowdb');
class Avatar extends Command {

    constructor(client) {
        super(client, {
            name: "avatar",
            description: "Etiketlenen kişinin avatarını gösterir",
            usage: "avatar @etiket/id",
            examples: ["avatar", "avatar 674565119161794560"],
            category: "Genel",
            cmdChannel: "bot-komut",
            cooldown: 10000
        });
    }

    async run(client, message, args) {
        const emojis = await low(client.adapters('emojis'));
        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        if (!mentioned) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("kullaniciyok").value()} Kullanıcı bulunamadı!`).setColor('#2f3136'));
        message.channel.send(new Discord.MessageEmbed().setColor('#2f3136').setImage(mentioned.user.displayAvatarURL({ dynamic: true, size: 4096 })));
    }
}

module.exports = Avatar;