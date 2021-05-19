const Discord = require("discord.js");
const client = new Discord.Client();
const tokens = require('../../BASE/config.json');
client.login(tokens.CD6);
const mongoose = require('mongoose');
mongoose.connect(tokens.mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
const Members = require("../../MODELS/Datalake/Registered");
function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)) };
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const settings = require('../../HELPERS/config');
client.on('ready', async () => {
    const utiller = low(new FileSync('./../../BASE/_utils.json')).value();
    const guild = client.guilds.cache.get(settings.server);
    const sayı = Math.floor(guild.memberCount / utiller.CdSize);
    const array = guild.members.cache.array().slice((sayı * 6), (sayı * 6));
    for (let index = 0; index < array.length; index++) {
        const membr = array[index];
        const Data = await Members.findOne({ _id: membr.user.id });
        if (Data) await membr.roles.add(roles.get(Data.sex).value());
    }
});
client.on("error", (err) => { console.error(err); });
