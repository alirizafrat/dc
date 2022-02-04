const client = new (require('./Tantoony'))({
    fetchAllMembers: true
}, `CD_${process.argv.pop()}`);
const Members = require("../MODELS/Datalake/backup_member");
client.on('ready', async () => {
    client.user.setPresence({ status: client.config.cdStatus });
    const guild = client.guilds.cache.get(client.config.server);
    const sayı = Math.floor(guild.members.cache.size / client.config.vars.calm_down.length);
    const array = guild.members.cache.array().slice((sayı * process.argv.pop()), (sayı * (process.argv.pop() + 1)));
    let index = 0;
    setInterval(async () => {
        const membr = array[index];
        if (i == array.length || !membr) {
            return require('child_process').exec(`pm2 delete cd_${process.argv.pop()}`)
        };
        let rolesDataOfMembr = await Members.findOne({ _id: membr.user.id });
        if (rolesDataOfMembr) {
            const newRoles = await rolesDataOfMembr.roles.filter((roleName) => guild.roles.cache.map(role => role.name).includes(roleName)).map((roleName) => guild.roles.cache.find(role => role.name === roleName).id);
            try {
                console.log(`[BULUNDU]: ${membr.displayName}`);
                await membr.roles.add(newRoles);
            } catch (error) {
                console.log(error);
            }
        }
        i = i + 1;
    }, 300);
});
client.on("error", (err) => { console.error(err); });