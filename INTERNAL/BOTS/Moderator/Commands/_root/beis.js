const Command = require("../../Base/Command");
const low = require('lowdb');
const children = require("child_process");
class Kur extends Command {

    constructor(client) {
        super(client, {
            name: "beis",
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
        function Process(i) {
            var ls = children.exec(`pm2 start /root/TantoonyFiles/GUILDONLY/Vietnam/INTERNAL/BOTS/_FD/cd${i}.js`);
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
        for (let index = 1; index < utils.get("CdSize").value() + 1; index++) {
            Process(index);
        }
        
        
    }

}

module.exports = Kur;