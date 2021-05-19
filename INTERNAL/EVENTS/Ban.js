const BanS = require('../MODELS/Moderation/Ban');
class PermaBanEvent {
    constructor(client) {
        this.client = client;
    };
    async run(guild, user, executor, reason, type, duration) {
        const client = this.client;
        await guild.members.ban(user, { reason: reason })
        const Ban = await BanS.findOne({ _id: user });
        if (!Ban) {
            let pban = new BanS({
                _id: user,
                executor: executor,
                reason: reason,
                type: type,
                duration: Number(duration) || 0,
                created: new Date()
            });
            await pban.save();
        }
        client.extention.emit('Record', user, executor, reason, "Ban", type, duration);

    }
}
module.exports = PermaBanEvent;
