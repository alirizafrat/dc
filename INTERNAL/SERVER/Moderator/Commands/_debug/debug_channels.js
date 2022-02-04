const Command = require("../../Base/Command");
const low = require('lowdb');
const Discord = require('discord.js');
const { stripIndents } = require("common-tags");
const VoiceChannels = require("../../../../MODELS/Datalake/VoiceChannels");
const TextChanels = require("../../../../MODELS/Datalake/TextChannels");
const CatChannels = require("../../../../MODELS/Datalake/CatChannels");
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
        const Vchannels = await VoiceChannels.find();
        if (!args[0] || (args[0] === "ses")) {
            for (let index = 0; index < Vchannels.length; index++) {
                const channeldata = Vchannels[index];
                const channel = message.guld.channels.cache.get(channeldata._id);
                if (!channel) await VoiceChannels.deleteOne({ _id: channeldata._id });
                await VoiceChannels.updateOne({ _id: channel.id }, {
                    $set: {
                        name: channel.name,
                        bitrate: channel.bitrate,
                        parentID: channel.parentID,
                        position: channel.position
                    }
                });
            }
        }
        const Tchannels = await TextChanels.find();
        if (!args[0] || (args[0] === "text")) {
            for (let index = 0; index < Tchannels.length; index++) {
                const channeldata = Tchannels[index];
                const channel = message.guld.channels.cache.get(channeldata._id);
                if (!channel) await VoiceChannels.deleteOne({ _id: channeldata._id });
                await VoiceChannels.updateOne({ _id: channel.id }, {
                    $set: {
                        name: channel.name,
                        nsfw: channel.nsfw,
                        parentID: channel.parentID,
                        position: channel.position,
                        rateLimit: channel.rateLimitPerUser
                    }
                });
            }
        }
        const Cchannels = await CatChannels.find();
        if (!args[0] || (args[0] === "cat")) {
            for (let index = 0; index < Cchannels.length; index++) {
                const channeldata = Cchannels[index];
                const channel = message.guld.channels.cache.get(channeldata._id);
                if (!channel) await VoiceChannels.deleteOne({ _id: channeldata._id });
                await VoiceChannels.updateOne({ _id: channel.id }, {
                    $set: {
                        name: channel.name,
                        position: channel.position
                    }
                });
            }
        }


    }

}

module.exports = Kur;