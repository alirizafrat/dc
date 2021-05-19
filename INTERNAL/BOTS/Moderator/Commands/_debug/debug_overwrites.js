const Command = require("../../Base/Command");
const low = require('lowdb');
const Discord = require('discord.js');
const { stripIndents } = require("common-tags");
const Overwrites = require("../../../../MODELS/Datalake/Overwrites");
class Kur extends Command {

    constructor(client) {
        super(client, {
            name: "debug_channels",
            description: "Açıklama Belirtilmemiş.",
            usage: "Kullanım Belirtilmemiş.",
            examples: ["Örnek Bulunmamakta"],
            category: "OWNER",
            aliases: ["db.c"],
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
        const channelss = await message.guild.channels.cache.array()
        for (let index = 0; index < channelss.length; index++) {
            const channel = channelss[index];
            const olddata = await overwrites.findOne({ _id: channel.id });
            if (!olddata) {
                const newData = new Overwrites({ _id: channel.id, overwrites: channel.permissionOverwrites.array() });
                await newData.save();
            } else {
                await Overwrites.updateOne({ _id: channel.id }, { $set: { overwrites: channel.permissionOverwrites.array() } });
            }
        }

    }

}

module.exports = Kur;