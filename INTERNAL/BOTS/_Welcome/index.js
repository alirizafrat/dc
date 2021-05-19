const Discord = require('discord.js');
const config = require('../../BASE/config.json');
const tokens = [
    config.SES1,
    config.SES2,
    config.SES3
];
const chnls = [
    "795403349615837191",
    "795511833833766912",
    "795511848534802473"
];
const sestokens = [
    config.Assistant,
    config.Cheif,
    config.Database,
    config.Management,
    config.Moderator,
    config.Organizer
];
for (let index = 0; index < sestokens.length; index++) {
    const token = sestokens[index];
    const client = new Discord.Client();
    client.login(token);
    client.on('ready', async () => {
        console.log(client.user.username);
        await client.channels.cache.get('838225388605276190').join();
        await client.user.setPresence({
            status: "online",
            activity: {
                type: "LISTENING",
                name: "ZİH̨̢̀İ͚̹Ņ͟͝SE͎͔̪L̖ ̅̏̃҉SO̅RU̿͂ͣǸ̅̏ ͋̅͊Y̷̸͟Aͯ̋̈RDIͫ̄͠M̄̃̏ ͑ͪͬE̒̎ͫDİͥ̌͑N"
            }
        });
    });
    client.on('voiceStateUpdate', async (prev, cur) => {
        if (cur.member.user.id !== client.user.id) return;
        if (!cur.guild.members.cache.get(client.user.id).voice.channel) return client.channels.cache.get('838225388605276190').join();
    });
}
const selamlı = [];
for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index];
    const client = new Discord.Client();
    client.login(token);
    let concon;
    client.on('ready', async () => {
        console.log(client.user.username);
        concon = await client.channels.cache.get(chnls[index]).join();
        await client.user.setPresence({
            status: "online",
            activity: {
                type: "LISTENING",
                name: "a̵̓̆k̴͗̀ı̵̎͜l̵̀͘ ̸̈́̅s̴̼͗a̶̍͛ğ̸̉͝l̴̛̞ı̶̡̓ğ̵͋͋ı̶͊̌n̸̑̊ı̶̽͌ ̵̀͠k̴̆͘a̶̎͒y̵͊̇b̵̠̿ḛ̷̌ẗ̷̙́"
            }
        });
    });
    let ses;
    const options = {
        quality: 'highestaudio',
        volume: 0.3,
        bitrate: 'auto'
    }
    client.on('voiceStateUpdate', async (prev, cur) => {
        if (cur.member.user.bot) return;
        if (cur.channel && (cur.channel.id === chnls[index])) {
            if (cur.channelID === prev.channelID) return;
            if (selamlı.includes(cur.member.id) && (cur.member.roles.highest.rawPosition <= cur.guild.roles.cache.get("795416819019415614").rawPosition)) {
                ses = await concon.play('./ses_tekrardan.mp3', options);
                return;
            }
            if ((cur.member.roles.highest.rawPosition <= cur.guild.roles.cache.get("795416819019415614").rawPosition)) {
                ses = await concon.play('./ses_merhaba.mp3', options);
                selamlı.push(cur.member.user.id);
            } else if ((cur.member.roles.highest.rawPosition >= cur.guild.roles.cache.get('795416819019415614').rawPosition) && cur.channel.members.filter(m => m.roles.highest.rawPosition >= prev.guild.roles.cache.get('795416819019415614').rawPosition).size === 2) {
                ses = await concon.play('./ses_yetkili.mp3', options);
                selamlı.push(cur.member.user.id);
            }
        }
        if (prev.channel && (prev.channel.id === chnls[index]) && (prev.channel.members.size === 1) && ses) ses.end();
    });
    client.on('guildMemberUpdate', async (prev, cur) => {
        if (concon.channel.members.some(biri => biri.user.id === cur.user.id)) {
            if ((prev.roles.highest.rawPosition < cur.roles.highest.rawPosition)) {
                ses = await concon.play('./ses_elveda.mp3', options);
            }
        } else return;
    });
    client.on('voiceStateUpdate', async (prev, cur) => {
        if (cur.member.id === client.user.id) concon = await client.channels.cache.get(chnls[index]).join();
    })
}