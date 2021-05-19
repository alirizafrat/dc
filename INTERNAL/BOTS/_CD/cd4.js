const Discord = require("discord.js");
const client = new Discord.Client();
const tokens = require('../../BASE/config.json');
client.login(tokens.CD4);
const mongoose = require('mongoose');
mongoose.connect(tokens.mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
const Members = require("../../MODELS/Datalake/MemberRoles");
function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)) };
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const settings = require('../../HELPERS/config');
client.on('ready', async () => {
    await client.user.setPresence({
        status: "idle",
        activity: {
            name: "a̵̓̆k̴͗̀ı̵̎͜l̵̀͘ ̸̈́̅s̴̼͗a̶̍͛ğ̸̉͝l̴̛̞ı̶̡̓ğ̵͋͋ı̶͊̌n̸̑̊ı̶̽͌ ̵̀͠k̴̆͘a̶̎͒y̵͊̇b̵̠̿ḛ̷̌ẗ̷̙́",
            type: "WATCHING"
        }
    });
    const utiller = low(new FileSync('./../../BASE/_utils.json')).value();
    const guild = client.guilds.cache.get(settings.server);
    const sayı = Math.floor(guild.memberCount / utiller.CdSize);
    const array = guild.members.cache.array().slice((sayı * 3), (sayı * 4));
    for (let index = 0; index < array.length; index++) {
        const membr = array[index];
        let yalak = [];
        let system = await Members.findOne({ _id: membr.user.id });
        if (system) {
            await system.roles.forEach(rolisimi => {
                const rol = guild.roles.cache.find(r => r.name === rolisimi);
                if (rol) yalak.push(rol.id);
            });
            try {
                console.log(`[BULUNDU]: ${membr.displayName}`);
                await membr.roles.add(yalak);
                sleep(250);
            } catch (error) {
                console.log(error)
            }
        }
    }
});
client.on("error", (err) => { console.error(err); });
