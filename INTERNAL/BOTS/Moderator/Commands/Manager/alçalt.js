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

        const taglırol = message.guild.roles.cache.get(roles.get("starter").value());

        const hoistroller = message.guild.roles.cache
            .filter(r => r.rawPosition > taglırol.rawPosition + 2)
            .filter(r => r.hoist)
            .filter(r => r.id !== roles.get("booster").value())
            .sort((a, b) => a.rawPosition - b.rawPosition).array().reverse();
        //oistroller.forEach(r => console.log(r.name));
        const rawrol = mentioned.roles.cache.filter(r => r.hoist).sort((a, b) => a.rawPosition - b.rawPosition).array().reverse()[0];
        let currol = hoistroller.find(r => r.rawPosition < rawrol.rawPosition);
        let oldrol = hoistroller.find(r => r.rawPosition === rawrol.rawPosition);
        if (!currol) currol = hoistroller.reverse()[0];
        if (currol.rawPosition > message.guild.roles.cache.get(roles.get("finisher").value()).rawPosition) return message.channel.send("Bu imkansız!");
        if (currol) await mentioned.roles.add(currol.id);
        if (oldrol) await mentioned.roles.remove(oldrol.id);
        await message.channel.send(`Üzgünüm ${mentioned}. Umarım ilerde tekrar yükselirsin..`);

        let embedsex = new Discord.MessageEmbed()
            .setAuthor(`Tantoony Hepinizi Seviyor`, message.guild.owner.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
            .setColor("#ffffff")
            .setTitle("Bir rol verildi!")
            .setFooter("26 Ağustos 2020'den İtibaren...", client.user.displayAvatarURL())
            .addField("Komutu kullanan: ", message.member, true)
            .addField("Kullanıcı:", mentioned, true)
            .addField("Verilen rol: ", currol, true)
            //.addField("Sebep: ", sebep, true)
            .setDescription(`${mentioned} Kullanıcısına yetki verildi!`)
            .setTimestamp()
            .setThumbnail(mentioned.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }));

        //await message.guild.channels.cache.get(kanallar.get("cmd-yetki").value()).send(embedsex);
        //this.client.cmdCooldown[message.author.id][this.help.name] = Date.now() + this.info.cooldown;

    }
}

module.exports = Upgrade;