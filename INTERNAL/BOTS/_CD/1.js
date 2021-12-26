module.exports = (number) => {
const client = new (require('../../BASE/Tantoony'))({
    fetchAllMembers: true
}, number);
require('dotenv').config({ path: __dirname + '/../../../.env' });
client.login(process.env.cd1);
client.handler.mongoLogin();
const Members = require("../../MODELS/Datalake//backup_member");
function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)) };
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const settings = require('../../HELPERS/config');
client.on('ready', async () => {
    const utiller = low(new FileSync('./../../BASE/_utils.json')).value();
    await client.user.setPresence(utiller.cdPresence);
    const guild = client.guilds.cache.get(settings.server);
    const sayı = Math.floor(guild.members.cache.size / utiller.CdSize);
    const array = guild.members.cache.array().slice((sayı * 0), (sayı * 1));
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
}