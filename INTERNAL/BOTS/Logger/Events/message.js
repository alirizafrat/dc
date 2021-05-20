const low = require('lowdb');
const Discord = require('discord.js');
const afkdata = require('../../../MODELS/Temprorary/AfkData');
const { checkHours } = require('../../../HELPERS/functions')
class Message {
    constructor(client) {
        this.client = client;
    };
    async run(message) {
        const client = this.client;
        if (message.guild.id !== client.config.server) return;
        if (message.author.bot) return;
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        //if (eskimesaj.content !== message.content) return
        //if (message.member.roles.cache.has()) return;
        let uCooldown = client.spamwait[message.author.id];
        if (!uCooldown) {
            client.spamwait[message.author.id] = {};
            uCooldown = client.spamwait[message.author.id];
        };
        let time = uCooldown[message.content] || 0;
        if (time && (time > Date.now())) {
            let uCount = client.spamcounts[message.author.id];
            if (!uCount) {
                this.client.spamcounts[message.author.id] = {};
                uCount = this.client.spamcounts[message.author.id];
                //console.log(uCount);
            };
            let count = uCount[message.content] || 0;
            //console.log(uCount);
            if (count === 1) message.channel.send(`Spamlamaya devam edersen muteleneceksin! ${message.author}`);
            if (count === 3) {
                message.member.roles.add(roles.get("muted").value());
                message.channel.send(`${message.member} Spam yaptığın için mutelendin!`)
            }
            if (count >= 1) await message.delete();
            this.client.spamcounts[message.author.id][message.content] = count + 1;
        }
        this.client.spamwait[message.author.id][message.content] = Date.now() + 3000;
        let system = await afkdata.findOne({ _id: message.member.user.id });
        if (system) {
            message.channel.send(new Discord.MessageEmbed().setDescription(`Seni tekrardan görmek ne güzel ${message.member}!\n${system.inbox.length > 0 ? `${system.inbox.length} yeni mesajın var!\n●▬▬▬▬▬▬▬▬▬●\n${system.inbox.map(content => `[${message.guild.members.cache.get(content.userID) || "Bilinmiyor"}]: ${content.content}`).join('\n')}` : "Hiç yeni mesajın yok!"}`));
            await afkdata.deleteOne({ _id: message.member.user.id });
        }
        if (message.mentions.members.first()) {
            const afksindata = await afkdata.find();
            const afks = message.mentions.members.array().filter(m => afksindata.some(doc => doc._id === m.user.id));
            if (afks.length > 0) {
                message.channel.send(new Discord.MessageEmbed().setDescription(afks.map(afk => `${afk} \`${afksindata.find(data => data._id === afk.user.id).reason}\` sebebiyle, **${checkHours(afksindata.find(data => data._id === afk.user.id).created)}** saattir AFK!`).join('\n')));
                await afks.forEach(async afk => {
                    await afkdata.updateOne({ _id: afk.user.id }, {
                        $push: {
                            inbox: {
                                content: message.content,
                                userID: message.author.id
                            }
                        }
                    });
                });
            }
        }
        const elebaşı = ["discord.gg/", "discord.com/invite/", "discordapp.com/invite/", "discord.me/"];
        if (message.guild && elebaşı.some(link => message.content.includes(link))) {
            let anan = [];
            await message.guild.fetchInvites().then(async (invs) => {
                invs.forEach(async (inv) => {
                    anan.push(inv.code);
                });
                anan.push('pandomeme');
                anan.push('')
            });
            for (let c = 0; c < elebaşı.length; c++) {
                const ele = elebaşı[c];
                if (message.content.includes(ele)) {
                    const mesaj = message.content.split(ele).slice(1).map(sth => sth.split(' ')[0]);
                    mesaj.forEach(async msg => {
                        if (!anan.some(kod => msg === kod)) {
                            message.guild.members.ban(message.author.id, { days: 2, reason: 'REKLAM' });
                            await message.delete();
                        }
                    });
                }
            }
        }

    }
}
module.exports = Message;