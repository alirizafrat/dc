const { ApplicationCommand } = require('discord.js');

module.exports = class SlashKayit extends ApplicationCommand {
    constructor(client) {
        super(client, {
            name: "kayıt",
            description: "Kullanıcıyı kayıt eder",
            options: [
                {
                    type: "USER",
                    name: "kullanıcı",
                    description: "Banlanacak kullanıcı/id",
                    required: true,
                },
                {
                    type: "STRING",
                    name: "cinsiyet",
                    description: "Kullanıcın cinsiyeti",
                    choices: [
                        {
                            name: "Erkek",
                            value: "Male"
                        },
                        {
                            name: "Kadın",
                            value: "Female"
                        }
                    ],
                    required: true,
                },
                {
                    type: "STRING",
                    name: "isim",
                    description: "Kullanıcının ismi",
                    required: true,
                },
                {
                    type: "NUMBER",
                    name: "yaş",
                    description: "Kullanıcının Yaşı",
                    required: false,
                },
                {
                    type: "STRING",
                    name: "not",
                    description: "Ceza notu",
                    required: false,
                }
            ]
        }, client.guild, client.guild.id);
        this.init();
    }
    run() {

    }
    init() {

    }
}