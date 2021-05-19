const model = require('../../../MODELS/StatUses/Invites');
const cmutes = require('../../../MODELS/Moderation/ChatMuted');
const Jails = require('../../../MODELS/Moderation/Jails');
const regData = require('../../../MODELS/Datalake/Registered');
const low = require("lowdb");
const Discord = require('discord.js');
const { welcomeMsg, checkDays, rain } = require('../../../HELPERS/functions');
const { stripIndents } = require('common-tags');
class GuildMemberAdd {

    constructor(client) {
        this.client = client;
    }

    async run(member) {
        const client = this.client;
        if (member.guild.id !== client.config.server) return;
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        if (member.user.bot) {
            const entry = await member.guild.fetchAuditLogs({ type: "BOT_ADD" }).then(logs => logs.entries.first());
            if (client.config.owner === entry.executor.id) {
                await member.guild.channels.cache.get(channels.get("guard").value()).send(`${emojis.get("accepted_bot").value()} ${client.owner} Tarafından ${member} botu başarıyla eklendi.`);
                await member.roles.add(roles.get("bots").value());
            } else {
                await member.kick("Korundu");
                const exeMember = member.guild.members.cache.get(entry.executor.id);
                client.extention.emit("Ban", member.guild, exeMember, this.client.user.id, "KDE - Bot Ekleme", "Perma", 1);
            }
            return;
        }
        let davetci = {};
        let count = 0;
        if (member.guild.vanityURLCode) {
            let aNumber = 0;
            await member.guild.fetchVanityData().then(data => { aNumber = data.uses }).catch(console.error);
            if (utils.get("vanityUses").value() < aNumber) {
                await member.guild.fetchVanityData().then(data => { utils.update("vanityUses", n => data.uses).write(); }).catch(console.error());
                davetci = {
                    username: "ÖZEL URL"
                };
            }
        }
        await member.guild.fetchInvites().then(async gInvites => {
            const invData = client.invites[member.guild.id];
            let invite = gInvites.find(inv => inv.uses > invData.get(inv.code).uses) || invData.find(i => !gInvites.has(i.code));
            if (invite) {
                davetci = invite.inviter;
                const obj = {
                    user: member.user.id,
                    created: new Date()
                };
                let systeminv = await model.findOne({ _id: davetci.id });
                if (!systeminv) {
                    try {
                        let save = new model({ _id: davetci.id, records: [] });
                        await save.save();
                    } catch (error) {
                        console.log(error);
                    }
                }
                systeminv = await model.findOne({ _id: davetci.id });
                const dosyam = await systeminv.get('records');
                if (!dosyam.some(entry => entry.user === member.user.id)) await model.updateOne({ _id: davetci.id }, { $push: { records: obj } });
                count = dosyam.length + 1 || 1;
            }
        });
        let pointed = '•';
        /*
        if (member.user.username.includes(client.config.tag)) {
            pointed = client.config.tag;
            await member.roles.add(roles.get("taglı").value());
        }
        */
        await member.guild.fetchInvites().then(guildInvites => { client.invites[member.guild.id] = guildInvites });
        if (utils.get("forbidden").value().some(tag => member.user.username.includes(tag))) {
            let registered = await regData.findOne({ _id: member.user.id });
            if (registered) await member.setNickname(`${pointed} ${registered.name}`);
            await member.roles.add([roles.get("forbidden").value(), roles.get("karantina").value()]);
            const embedf = welcomeMsg(member, "Yasaklı Tagda");
            await member.guild.channels.cache.get(channels.get("registry").value()).send(embedf);
            const forbidMsg = `Aramıza katılman bizi onurlandırdı ${member} fakat ne yazık ki seni taşıdığın bir tagdan dolayı içeri alamayacağım.`;
            return member.guild.channels.cache.get("forbidden").send(forbidMsg);
        }
        let pJail = await Jails.findOne({ _id: member.user.id });
        if (pJail) {
            if ((pJail.reason === "YASAKLI TAG") && !utils.get("forbidden").value().some(tag => member.user.username.includes(tag))) {
                await pJails.deleteOne({ _id: member.user.id });
            } else {
                let registered = await regData.findOne({ _id: member.user.id });
                if (registered) await member.setNickname(`${pointed} ${registered.name}`);
                await member.roles.add([roles.get("prisoner").value(), roles.get("karantina").value()]);
                const embedded = welcomeMsg(member, "Kalıcı Cezalı");
                await member.guild.channels.cache.get(channels.get("registry").value()).send(embedded);
                const forbidMsg = `Aramıza katılman bizi onurlandırdı ${member} fakat ne yazık ki seni cezalı olduğundan dolayı içeri alamayacağım.`;
                return member.guild.channels.cache.get(channels.get("prisoner").value()).send(forbidMsg);
            }
        }
        let mute = await cmutes.findOne({ _id: member.user.id });
        if (mute) await member.roles.add(roles.get("muted").value());
        if (checkDays(member.user.createdAt) < 7) {
            let registered = await regData.findOne({ _id: member.user.id });
            if (registered) await member.setNickname(`${pointed} ${registered.name}`);
            await member.roles.add([roles.get("suspicious").value(), roles.get("karantina").value()]);
            const embedded = welcomeMsg(member, "Şüpheli");
            await member.guild.channels.cache.get(channels.get("registry").value()).send(embedded);
            const forbidMsg = `Aramıza katılman bizi onurlandırdı ${member} fakat ne yazık ki hesabın çok yeni olduğundan dolayı içeri alamayacağım.`;
            return member.guild.channels.cache.get("suspicious").send(forbidMsg);
        }
        let registered = await regData.findOne({ _id: member.user.id });
        if (registered) {
            if (utils.get("taglıAlım").value()) return await member.setNickname(`${pointed} ${registered.name}`);
            await member.roles.add(roles.get(registered.sex).value().concat(roles.get("member").value()));
            await member.setNickname(`${pointed} ${registered.name}`);
            return;
        }
        const att = new Discord.MessageAttachment(`../../SRC/welcome/welcome.jpg`, 'welcome.jpg');
        await member.roles.add(roles.get("welcome").value());
        const yetkili = member.guild.roles.cache.get(roles.get("cmd-registry").value());
        const embed = new Discord.MessageEmbed()
            .setColor("#2f3136").setTitle(member.guild.name)
            .setFooter(`Kayıtta ses vermek zorunludur. | ${new Date(Date.now()).getUTCDate()}.${new Date(Date.now()).getUTCMonth() + 1}.${new Date(Date.now()).getUTCFullYear()}`, client.user.displayAvatarURL())
            .setDescription(
                stripIndents`
            
         ${emojis.get("pando1").value()} Aramıza hoş geldin **${member.user.username}**
    
         ${emojis.get("pando2").value()} Seninle beraber **${rain(client, member.guild.memberCount)}** kişiyiz.
    
         ${emojis.get("pando3").value()} Seni buraya getiren kişi: **${davetci ? davetci.username : "ÖZEL URL"}** [\`Davet Sayısı: ${count}\`]
    
         ${emojis.get("pando4").value()} **Hesap:** ${rain(client, checkDays(member.user.createdAt))} gün önce açılmıştır.
     
         ${emojis.get("pando5").value()} Kayıt olmak için ${yetkili} rolündeki yetkilileri etiketleyebilirsin.
        
        `).setThumbnail(member.user.displayAvatarURL()).setImage('attachment://welcome.jpg').attachFiles(att);

        member.guild.channels.cache.get(channels.get("welcome").value()).send(embed);
        //member.guild.channels.cache.get(channels.get("welcome").value()).send(`${yetkili}`).then(msg => msg.delete({ timeout: 200 }));
        member.guild.channels.cache.get(channels.get("registry").value()).send(welcomeMsg(member, "İZİNLİ").setColor('#2e6b3f'));

    }
}

module.exports = GuildMemberAdd;