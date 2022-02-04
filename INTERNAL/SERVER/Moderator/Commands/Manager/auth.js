const Discord = require('discord.js');
const Command = require("../../Base/Command");
const low = require('lowdb');
class Upgrade extends Command {

    constructor(client) {
        super(client, {
            name: "alçalt",
            description: "Belirtilen kullanıcının yetkisini alçaltır",
            usage: "alçalt @etiket/id",
            examples: ["alçalt 674565119161794560"],
            category: "Management",
            accaptedPerms: ["cmd-all"]
        });
    }

    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("kullaniciyok").value()} Kullanıcı bulunamadı!`).setColor('#2f3136'));
        const embed = new Discord.MessageEmbed().setColor('#2f3136');
        if (message.member.roles.highest.rawPosition <= mentioned.roles.highest.rawPosition) return message.channel.send(embed.setDescription(`${emojis.warn} Bunu yapmak için yeterli yetkiye sahip değilsin`));

        

        //await message.guild.channels.cache.get(kanallar.get("cmd-yetki").value()).send(embedsex);
        //this.client.cmdCooldown[message.author.id][this.help.name] = Date.now() + this.info.cooldown;

    }
}

module.exports = Upgrade;