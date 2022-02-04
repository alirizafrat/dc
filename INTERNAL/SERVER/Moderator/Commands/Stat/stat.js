const Command = require('../../Base/Command');
const low = require('lowdb');
const Discord = require('discord.js');
const { checkDays, rain } = require('../../../../HELPERS/functions');
const StatData = require('../../../../MODELS/StatUses/VoiceRecords');
const { stripIndents } = require('common-tags');
const stringTable = require('string-table');
class Invites extends Command {
    constructor(client) {
        super(client, {
            name: "stat",
            description: "Belirtilen kullanıcının istatistiklerini gösterir",
            usage: "stat @etiket/id",
            examples: ["stat 674565119161794560"],
            category: "Stat",
            aliases: ["st"],
            cooldown: 10000
        })
    }
    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        const Data = await StatData.findOne({ _id: mentioned.user.id });
        if (!Data) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("kullaniciyok").value()} Data bulunamadı.`).setColor('#2f3136'));

        const objj = {
            "st_public": "Genel kanallar",
            "st_private": "Özel kanallar",
            "st_registry": "Kayıt kanalları",
            "st_prison": "Hapishane",
            "st_crew": "Yetkili kanalları",
        }

        function statconv(item) {
            item = item.replace((item), element => {
                return objj[element];
            });
            return item;
        }
        const records = Data.records.filter(r => checkDays(r.enter) < (args[1] || 7));
        let myStats = {};
        for (let indeex = 0; indeex < records.length; indeex++) {
            const entry = records[indeex];
            let cType = "Diğer";
            if (entry.channelType) cType = statconv(entry.channelType);
            if (!myStats[cType]) myStats[cType] = 0;
            myStats[cType] = myStats[cType] + Math.floor(entry.duration / 60000);
        };
        let docs = [];
        for (let index = 0; index < Object.keys(myStats).length; index++) {
            const cData = Object.keys(myStats)[index];
            const valuem = Math.floor((Object.values(myStats)[index] * 100) / Object.values(myStats).reduce((a, b) => a + b));
            docs.push({
                'Tip': cData,
                '%??': '%' + valuem,
                'Saat': Math.floor(Object.values(myStats)[index] / 60)
            });
        }
        const embeddoc = stringTable.create(docs, {
            headers: ['Tip', '%??', 'Saat']
        });

        const buffer = await client.canvas.renderToBuffer({
            type: 'pie',
            data: {
                //labels: Object.keys(myStats),
                datasets: [{
                    //label: '# of Votes',
                    data: Object.values(myStats),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: 'rgb(255, 99, 132)',
                            font: {
                                family: "FONT"
                            }
                        }
                    }
                }
            }
        });


        const att = new Discord.MessageAttachment(buffer, 'Stat.png');
        await message.channel.send(new Discord.MessageEmbed().setTitle("PANDOMEME FOREVER").setDescription(stripIndents`
        ${mentioned} kişisine ait ${args[1] || "7"} günlük ses bilgileri aşağıda belirtilmiştir.
        \`\`\`${embeddoc}\`\`\`
        `).setImage("attachment://Stat.png").attachFiles(att));
    }
}
module.exports = Invites;