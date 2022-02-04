const Discord = require('discord.js');
const Command = require("../../Base/Command");
const low = require('lowdb');
class Git extends Command {

    constructor(client) {
        super(client, {
            name: "git",
            description: "İstediğiniz kişinin odasına gidin",
            usage: "git etiket/id",
            examples: ["git 674565119161794560"],
            category: "Genel",
            cmdChannel: "bot-komut",
            cooldown: 10000
        });
    }

    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("kullaniciyok").value()} Kullanıcı bulunamadı!`).setColor('#2f3136'));
        if (mentioned.user.id === message.member.user.id) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("pando1").value()} Kendi kendini etiketleme..`).setColor('#2f3136'));
        let kanal = mentioned.voice.channel;
        if (!kanal) return message.channel.send("Hangi kanalda olduğunu bulamıyorum!");
        const cagirembed = new Discord.MessageEmbed()
            .setColor('#4b777e')
            .setAuthor(message.guild.name, message.guild.iconURL({ format: 'png', dynamic: true, size: 1024 }))
            .setFooter(message.member.displayName, message.member.user.displayAvatarURL())
            .setTimestamp()
            //.setTitle("Birisinin sana ihtiyacı var!")
            .setDescription(`Sevgili ${mentioned}, ${message.member} kanalına gelmek istiyor.`)
            .setThumbnail(mentioned.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
        try {
            var akısmoji = await message.channel.send(cagirembed);
            await akısmoji.react("✔️");
            await akısmoji.react("❌");
        } catch (error) {
            console.error(error);
        }
        const filter = (reaction, user) => user.id !== message.client.user.id;
        const collector = akısmoji.createReactionCollector(filter, {
            time: 120000
        });
        collector.on("collect", async (reaction, user) => {
            if (user.id !== mentioned.user.id) return reaction.users.remove(user);
            kanal = mentioned.voice.channel;
            if (!kanal) {
                collector.stop();
                return message.channel.send("Hangi kanalda olduğunu bulamıyorum!");
            }
            switch (reaction.emoji.name) {
                case "✔️":
                    await message.member.voice.setChannel(kanal.id);
                    collector.stop();
                    await akısmoji.edit(cagirembed.setDescription(`${message.member} kullanıcısı başarıyla ${mentioned} kullanıcısının olduğu **${kanal.name}** isimli kanala taşınmıştır.`).setThumbnail(message.guild.iconURL()));
                    break;
                case "❌":
                    collector.stop();
                    break;
                default:
                    break;
            }
        });
        collector.on("end", async () => {
            await akısmoji.reactions.removeAll();
            await akısmoji.edit(cagirembed.setDescription(`${message.member} kullanıcısı başarıyla ${mentioned} kullanıcısının olduğu **${kanal.name}** isimli kanala taşınmıştır.`).setThumbnail(message.guild.iconURL()));
        });
    }
}

module.exports = Git;