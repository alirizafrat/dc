const Command = require('../../Base/Command');
const Discord = require('discord.js');
const low = require('lowdb');
const permited = require('../../../../MODELS/Datalake/Permited');
const { rain } = require('../../../../HELPERS/functions');
class Supheac extends Command {
    constructor(client) {
        super(client, {
            name: "supheac",
            description: "Şüpheli bir üyeyi kayıtsıza alır",
            usage: "supheac etiket/id",
            examples: ["supheac 674565119161794560"],
            category: "Kayıt",
            aliases: ["şüpheaç", "şüphemyok", "suphemyok"],
            cmdChannel: "suspicious",
            accaptedPerms: ["cmd-registry", "cmd-all"],
            cooldown: 10000
        });
    };
    async run(client, message, args) {
        client = this.client;
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("kullaniciyok").value()} Kullanıcı bulunamadı!`).setColor('#2f3136'));
        if (!mentioned.roles.cache.has(roles.get("suspicious").value())) return message.channel.send(new Discord.MessageEmbed().setDescription(`Etiketlediğin kişi şüpheli değil!`));
        await mentioned.roles.remove(roles.get("suspicious").value());
        const permission = await permited.findOne({ _id: mentioned.user.id });
        const yetkili = member.guild.roles.cache.get(roles.get("cmd-registry").value());
        if (permission) {
            await mentioned.roles.add(roles.get("welcome").value());
            const embed = new Discord.MessageEmbed()
                .setColor("#2f3136")
                .setDescription(
                    stripIndents`
            
         ${emojis.get("notice").value()} Aramıza hoş geldin **${mentioned.user.username}**
    
         ${emojis.get("diamond").value()} Seninle beraber **${rain(message.guild.memberCount)}** kişiyiz.
    
         ${emojis.get("rhtym2").value()} **Hesap:** ${rain(checkDays(mentioned.user.createdAt))} gün önce açılmıştır.
         
         ${emojis.get("saturn").value()} Kayıt olmak için ${yetkili} rolündeki yetkilileri etiketleyebilirsin.
        
        `).setThumbnail(mentioned.user.displayAvatarURL());
        await message.guild.channels.cache.get(channels.get("welcome").value()).send().send(embed);
        } else {
            await mentioned.roles.add(roles.get("nonwelcome").value());
            const referans = member.guild.channels.cache.get(channels.get("referans").value());
            const embed = new Discord.MessageEmbed()
                .setColor("#2f3136")
                .setDescription(
                    stripIndents`
            
         ${emojis.get("notice").value()} Aramıza hoş geldin **${mentioned.user.username}**
    
         ${emojis.get("diamond").value()} Seninle beraber **${rain(message.guild.memberCount)}** kişiyiz.
    
         ${emojis.get("rhtym2").value()} **Hesap:** ${rain(checkDays(mentioned.user.createdAt))} gün önce açılmıştır.
         
         ${emojis.get("announce").value()} İçeriye girebilmek için lütfen ${referans} kanalında kendini tanıt.
        
        `).setThumbnail(mentioned.user.displayAvatarURL());
        await message.guild.channels.cache.get(channels.get("nonwelcome").value()).send().send(embed);
        }
        await message.guild.channels.cache.get(channels.get("mod-registry").value()).send(new Discord.MessageEmbed().setDescription(`${message.member} yetkilisi ${mentioned} kullanıcısının şüphesini kaldırdı.`));
        await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));

    }
}
module.exports = Supheac;