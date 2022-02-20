const { ApplicationCommand, MessageEmbed } = require('discord.js');
const low = require('lowdb');

module.exports = class SlashSet extends ApplicationCommand {
    constructor(client, data, guild, guildId) {
        super(client, data = {
            name: "kurulum",
            description: "Data işlemleri",
            guildId: [guildId]
        }, guild, guildId);
        this.permissions = client.config.staff.slice(5).map(o => {
            return {
                id: o,
                type: "ROLE",
                permission: true
            }
        });
    }
    async run(client, intg) {
        const embed = new MessageEmbed().setDescription()
        const reply = await intg.repy({
            embeds: [embed],
            components: [{
                "title": "My Cool Modal",
                "custom_id": "cool_modal",
                "components": [{
                  "type": 1,
                  "components": [{
                    "type": 4,
                    "custom_id": "name",
                    "label": "Name",
                    "style": 1,
                    "min_length": 1,
                    "max_length": 4000,
                    "placeholder": "John",
                    "required": true
                  }]
                }]
              }
            ]
        })


    }
}