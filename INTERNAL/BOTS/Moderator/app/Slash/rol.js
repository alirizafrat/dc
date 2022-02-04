const { ApplicationCommand } = require('discord.js');

module.exports = class SlashRol extends ApplicationCommand {
    constructor(client) {
        super(client, {
            name: "rol",
            description: "Kullanıcıya rol ver/al",
            options: [
                {
                    type: "SUB_COMMAND",
                    name: "ver",
                    description: "Kullanıcıya rol verir",
                    options: [
                        {
                            type: "USER",
                            name: "kullanıcı",
                            description: "Rol verilecek kullanıcı/id",
                            required: true,
                        },
                        {
                            type: "STRING",
                            name: "rol",
                            description: "verilecek rol",
                            choices: [
                                {
                                    name: "chat mute",
                                    value: "chat"
                                },
                                {
                                    name: "voice mute",
                                    value: "voice"
                                }
                            ],
                            required: true,
                        },
                        {
                            type: "STRING",
                            name: "detay",
                            description: "sebep detayı",
                            required: false,
                        },
                        {
                            type: "STRING",
                            name: "not",
                            description: "İşlem notu",
                            required: false,
                        }
                    ]
                },
                {
                    type: "USER",
                    name: "kullanıcı",
                    description: "Rol verilecek kullanıcı/id",
                    required: true,
                },
                {
                    type: "STRING",
                    name: "rol",
                    description: "verilecek rol",
                    choices: [
                        {
                            name: "chat mute",
                            value: "chat"
                        },
                        {
                            name: "voice mute",
                            value: "voice"
                        }
                    ],
                    required: true,
                },
                {
                    type: "STRING",
                    name: "detay",
                    description: "sebep detayı",
                    required: false,
                },
                {
                    type: "STRING",
                    name: "not",
                    description: "İşlem notu",
                    required: false,
                },
                {
                    type: "SUB_COMMAND",
                    name: "al",
                    description: "Kullanıcıdan rol alır",
                    options: [
                        {
                            type: "USER",
                            name: "kullanıcı",
                            description: "Rolü alınacak kullanıcı/id",
                            required: true,
                        },
                        {
                            type: "STRING",
                            name: "rol",
                            description: "alınacak rol",
                            choices: [
                                {
                                    name: "chat mute",
                                    value: "chat"
                                },
                                {
                                    name: "voice mute",
                                    value: "voice"
                                }
                            ],
                            required: true,
                        },
                        {
                            type: "STRING",
                            name: "detay",
                            description: "sebep detayı",
                            required: false,
                        },
                        {
                            type: "STRING",
                            name: "not",
                            description: "İşlem notu",
                            required: false,
                        }
                    ]
                },
                {
                    type: "USER",
                    name: "kullanıcı",
                    description: "Rol verilecek kullanıcı/id",
                    required: true,
                },
                {
                    type: "STRING",
                    name: "rol",
                    description: "verilecek rol",
                    choices: [
                        {
                            name: "chat mute",
                            value: "chat"
                        },
                        {
                            name: "voice mute",
                            value: "voice"
                        }
                    ],
                    required: true,
                },
                {
                    type: "STRING",
                    name: "detay",
                    description: "sebep detayı",
                    required: false,
                },
                {
                    type: "STRING",
                    name: "not",
                    description: "İşlem notu",
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