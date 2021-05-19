const VoiceMuted = require('../MODELS/Moderation/VoiceMuted');
class PermaBanEvent {
    constructor(client) {
        this.client = client;
    };
    async run(member, executor, reason, duration) {
        const client = this.client;
        const voice = member.voice;
        if (voice && voice.channel) await voice.setMute(true, reason);
        const Ban = await VoiceMuted.findOne({ _id: member.user.id });
        if (!Ban) {
            let pban = new VoiceMuted({
                _id: member.user.id,
                executor: executor,
                reason: reason,
                duration: Number(duration) || 0,
                created: new Date()
            });
            await pban.save();
        }
        client.extention.emit('Record', executor, member.user.id, reason, "V-Mute", "temp", duration);
    }
}
module.exports = PermaBanEvent;
