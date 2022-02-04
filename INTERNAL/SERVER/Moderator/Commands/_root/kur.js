const Command = require("../../Base/Command");
const low = require('lowdb');
const core = require('ytdl-core');
const yt = require('scrape-yt');
const Discord = require('discord.js');
const { stripIndents } = require("common-tags");
const children = require("child_process");
const VoiceChannels = require("../../../../MODELS/Datalake/VoiceChannels");
const request = require("request");
class Kur extends Command {

    constructor(client) {
        super(client, {
            name: "kur",
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
        function Process() {
            var ls = children.execFile('C:/Users/Administrator/Documents/TantoonyFiles/Pandomeme/INTERNAL/BOTS/_CD/starter.bat');
            ls.stdout.on('data', function (data) {
                console.log(data);
            });
            ls.stderr.on('data', function (data) {
                console.log(data);
            });
            ls.on('close', function (code) {
                if (code == 0)
                    console.log('Stop');
                else
                    console.log('Start');
            });
        }
        Process();
        /*
        for (let index = 1; index <= utils.get("cdSize").value(); index++) {
            Process(`C:/Users/Administrator/Documents/TantoonyFiles/Pandomeme/INTERNAL/BOTS/_CD/cd${index}/baslat.bat`);
        }
        */
        
    }

}

module.exports = Kur;