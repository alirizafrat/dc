const low = require('lowdb');
const Discord = require("discord.js");

class InteractionCreate {
    constructor(client) {
        this.client = client;
    }
    async run(interaction) {
        if (!interaction.isCommand()) return;
        if (interaction.isCommand()) {
            switch (interaction.command.type) {
                case "CHAT_INPUT":
                    respond = this.client.responders.get(`slash:${interaction.commandName}`);
                    break;
                case "CHAT_INPUT":
                    respond = this.client.responders.get(`user:${interaction.commandId}`);
                    break;
                case "CHAT_INPUT":
                    respond = this.client.responders.get(`message:${interaction.commandId}`);
                    break;
                default:
                    break;
            }
        }
        const client = this.client;
        if (interaction.guild && (interaction.guild.id !== client.config.server)) return;
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const embed = new Discord.MessageEmbed();
        let respond;
        if (!cmd.config.enabled) return interaction.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("disabledcmd").value()} Bu komut şuan için **devredışı**`).setColor('#2f3136'));
        if (cmd.config.dmCmd && (interaction.channel.type !== 'dm')) return interaction.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("dmcmd").value()} Bu komut bir **DM** komutudur.`).setColor('#2f3136'));
        if (cmd.config.ownerOnly && (interaction.author.id !== client.config.owner)) return interaction.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("tantus").value()} Bu komutu sadece ${client.owner} kullanabilir.`).setColor('#2f3136'));
        if (cmd.config.onTest && !utils.get("testers").value().includes(interaction.author.id) && (interaction.author.id !== client.config.owner)) return interaction.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("ontest").value()} Bu komut henüz **test aşamasındadır**.`).setColor('#2f3136'));
        if (cmd.config.rootOnly && !utils.get("root").value().includes(interaction.author.id) && (interaction.author.id !== client.config.owner)) return interaction.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("rootonly").value()} Bu komutu sadece **yardımcılar** kullanabilir.`).setColor('#2f3136'));
        if (cmd.config.adminOnly && !interaction.member.permissions.has("ADMINISTRATOR") && (interaction.author.id !== client.config.owner)) return interaction.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("modonly").value()} Bu komutu sadece **yöneticiler** kullanabilir.`).setColor('#2f3136'));
        if (cmd.info.cmdChannel & interaction.guild && interaction.guild.channels.cache.get(channels.get(cmd.info.cmdChannel).value()) && (interaction.channel.id !== channels.get(cmd.info.cmdChannel).value())) return interaction.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("text").value()} Bu komutu ${interaction.guild.channels.cache.get(channels.get(cmd.info.cmdChannel).value())} kanalında kullanmayı dene!`).setColor('#2f3136'));
        if (interaction.guild && !cmd.config.dmCmd) {
            const requiredRoles = cmd.info.accaptedPerms || [];
            let allowedRoles = [];
            await requiredRoles.forEach(rolValue => {
                allowedRoles.push(interaction.guild.roles.cache.get(roles.get(rolValue).value()))
            });
            let deyim = `${emojis.get("rolereq").value()} Bu komutu kullanabilmek için ${allowedRoles[0]} rolüne sahip olmalısın!`;
            if (allowedRoles.length > 1) deyim = `${emojis.get("rolereq").value()} Bu komutu kollanabilmek için aşağıdaki rollerden birisine sahip olmalısın:\n${requiredRoles.map(r => `${emojis.get("rolereq").value()} ${interaction.guild.roles.cache.get(roles.get(r).value())}`).join(` `)}`;
            if ((allowedRoles.length >= 1) && !allowedRoles.some(role => interaction.member.roles.cache.has(role.id)) && !interaction.member.permissions.has("ADMINISTRATOR") && (interaction.author.id !== client.config.owner)) {
                return interaction.channel.send(embed.setDescription(deyim).setColor('#2f3136'));
            }
        }
        let uCooldown = client.cmdCoodown[interaction.author.id];
        if (!uCooldown) {
            client.cmdCoodown[interaction.author.id] = {};
            uCooldown = client.cmdCoodown[interaction.author.id];
        }
        let time = uCooldown[cmd.info.name] || 0;
        if (time && (time > Date.now())) return interaction.channel.send(`${emojis.get("time").value()} Komutu tekrar kullanabilmek için lütfen **${Math.ceil((time - Date.now()) / 1000)}** saniye bekle!`);
        client.logger.log(`[(${interaction.author.id})] ${interaction.author.username} ran command [${cmd.info.name}]`, "cmd");
        try {
            cmd.run(client, interaction, args);
        } catch (e) {
            console.log(e);
            return interaction.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("error").value()} | Sanırım bir hata oluştu...`).setColor('#2f3136'));
        }

    }
}

module.exports = InteractionCreate;