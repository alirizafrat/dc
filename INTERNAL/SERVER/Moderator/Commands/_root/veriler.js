const Command = require("../../Base/Command");
const low = require('lowdb');
const namedata = require('../../../../MODELS/Datalake/Registered');
const Discord = require('discord.js');
class Kur extends Command {

    constructor(client) {
        super(client, {
            name: "veriler",
            description: "Açıklama Belirtilmemiş.",
            usage: "Kullanım Belirtilmemiş.",
            examples: ["Örnek Bulunmamakta"],
            category: "OWNER",
            aliases: [],
            acceptedRoles: [],
            cooldown: 5000,
            enabled: true,
            adminOnly: false,
            ownerOnly: false,
            onTest: false,
            rootOnly: true,
            dmCmd: false
        });
    }

    async run(client, message, args, data) {

        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
    
        const array = message.guild.members.cache.filter(m => !m.roles.cache.has(roles.get("booster").value())).filter(m => roles.get("member").value().some(id => m.roles.cache.has(id))).array();
        for (let index = 0; index < array.length; index++) {
            const member = array[index];
            let system = await namedata.findOne({ _id: member.user.id });
            if (!system) {
                let asd = 'Male';
                let ism = member.displayName.slice(2);
                let arrs = ism.split(" | ")[1];
                let isim = ism.split(" | ")[0];
                if (!roles.get("Male").value().some(id => member.roles.cache.has(id)) && roles.get("Female").value().some(id => member.roles.cache.has(id))) asd = 'Female';
                try {
                    let sex = new namedata({ _id: member.user.id, executor: client.user.id, name: isim, age: arrs, sex: asd, created: new Date() });
                    console.log(`${member.displayName} | Kişisinin kaydı kaydediliyor..`)
                    await sex.save();
                } catch (error) {
                    throw error;
                }
            } else console.log(member.displayName);

        }
    }

}

module.exports = Kur;