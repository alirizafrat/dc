const Command = require("../../Base/Command");
const Discord = require("discord.js");
const sicil = require('../../../../MODELS/StatUses/Punishments');
const stringTable = require('string-table');
const { checkDays, sayi } = require('../../../../HELPERS/functions');
const { stripIndent } = require("common-tags");
class Sicil extends Command {

    constructor(client) {
        super(client, {
            name: "sicil",
            description: "Bir üyenin dosyaslarını açar",
            usage: "sicil etiket/id",
            examples: ["sicil 674565119161794560"],
            category: "Sorgu",
            aliases: [],
            accaptedPerms: ["cmd-jail"],
            cooldown: 60000,
        });
    }

    async run(client, message, args) {
        const embed = new Discord.MessageEmbed().setColor('#2f3136');
        let mentionedID = message.mentions.members.first() ? message.mentions.members.first().user.id : args[0] || message.member.user.id;
        const doc = await sicil.findOne({ _id: mentionedID });
        if (!doc) return message.channel.send("Dosya bulunamadı!")
        const scl = await doc.get("records").reverse();
        let asdf = [];
        for (let index = 0; index < scl.length; index++) {
            const element = scl[index];
            const shem = {
                no: index + 1,
                tür: element.type,
                gün: checkDays(element.created)
            };
            asdf.push(shem);
        }
        const embeddoc = stringTable.create(asdf, {
            headers: ['no', 'tür', 'gün']
        });
        if (!args[1]) return message.channel.send(embed.setDescription(`\`\`\`md\n${embeddoc}\`\`\``).setTitle('SİCİL KONTROL'));
        if (!sayi(args[1])) return message.channel.send(embed.setDescription(`Lütfen bir sayı belirle!`))
        const ecrin = scl[args[1] - 1];
        const ecrinim = embed.setDescription(stripIndent`
        **Tür:** \`${ecrin.type}\`
        **Sebep:**  \`${ecrin.reason}\`
        **Sorumlu:**  ${message.guild.members.cache.get(ecrin.executor) || "Bilinmiyor"}
        **Zaman:** \`${checkDays(ecrin.created)} gün önce\`
        **Süre:** \`${ecrin.duration}\`
        `).setTitle("Pandomeme EMNIYET");
        message.channel.send(ecrinim);
    }

}
module.exports = Sicil;