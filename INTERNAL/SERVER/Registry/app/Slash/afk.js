const low = require('lowdb');
const { MessageEmbed, ApplicationCommand } = require('discord.js');
module.exports = class AFKCommand extends ApplicationCommand {
    constructor(client, data, guild, guildId) {
        super(client, data = {
            name: 'afk',
            description: 'afk ayarlamak için kullanılır.',
            options: [
                {
                    type: "STRING",
                    name: 'sebep',
                    description: 'sebep belirtiniz',
                    required: true
                }
            ],
            guildId: [guildId]
        }, guild, guildId);
        this.filePath = __filename;
    }

    async run(ctx) {
        const client = ctx.creator.client;
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const channels = await low(client.adapters('channels'));
        const emojis = await low(client.adapters('emojis'));
        const system = await client.models.afk.findOne({ _id: ctx.user.id });
        if (!system) {
            await client.models.afk.create({
                _id: ctx.user.id,
                reason: Object.values(ctx.options)[0],
                created: new Date(),
                inbox: []
            });
            const embed = new MessageEmbed().setColor('#2f3136').setDescription(`${emojis.get("pando1").value()} Başarıyla Ayarlandı!`);
            await ctx.send({
                embeds: [embed]
            });
        } else return;
    }
}
