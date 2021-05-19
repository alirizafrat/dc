const Command = require("../../Base/Command");
const low = require('lowdb');
const Discord = require('discord.js');
const { stripIndents } = require('common-tags');
const { rain, checkDays } = require('../../../../HELPERS/functions');
class Link extends Command {

    constructor(client) {
        super(client, {
            name: "say",
            description: "sunucunun linkini gönderir",
            usage: "say",
            examples: ["say"],
            cooldown: 300000,
        });
    }

    async run(client, message, args) {
        
        const roller = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));


        //sunucudaki üye
        let emük = message.guild.memberCount;
        //console.log(emük);

        //çevrimiçi üye
        let anan =  await message.guild.members.cache.filter(mem => mem.presence.status !== 'offline').size;
       
        //console.log(anan);

        //tagdaki üye
        let ilksen = await message.guild.members.cache.filter(mem => mem.user.username.includes(client.config.tag)).size;
        
        //console.log(ilksen)

        //sesteki üye
        let inter = 0;
        await message.guild.members.cache.forEach(async (mem) => {
            if (mem.voice.channel) inter = inter + 1;
        });
        //console.log(inter);

        //Boost basan üye
        let tak = 0;
        await message.guild.members.cache.forEach(async (mem) => {
            if (mem.roles.cache.has(roller.get("booster").value())) tak = tak + 1;
        });
        
        const embed = new Discord.MessageEmbed().setColor('#2f3136')
        .setDescription(
            stripIndents`

${emojis.get("pando1").value()} Sunucumuzda **Toplam** ${rain(client, emük)} Üye Bulunmaktadır.

${emojis.get("pando1").value()} Anlık Olarak **Aktif** ${rain(client, anan)} Kullanıcı Bulunmaktadır.

${emojis.get("pando1").value()} **Tagımızda** ${rain(client, ilksen)} Kullanıcı Bulunmaktadır.

${emojis.get("pando1").value()} Sunucumuzda ${rain(client, tak)} Tane **Booster** Bulunmaktadır.

${emojis.get("pando1").value()} **Ses Kanallarında** ${rain(client, inter)} Kişi Bulunmaktadır.
`
        )
        //.setFooter(message.author.tag, message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
        .setAuthor(message.guild.name, message.guild.iconURL({ format: 'png', dynamic: true, size: 1024 }))

        .setFooter(message.author.tag, message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
        //.setTimestamp()

        message.channel.send(embed);
        await message.react(emojiler.get("tantoony").value().split(':')[2].replace('>', ''));



    }
}

module.exports = Link;