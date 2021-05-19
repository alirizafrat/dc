const fs = require('fs');
const util = require('util');
const readdir = util.promisify(fs.readdir);
class Initialize {
    async events(client, filePath, dirname) {
        const evtFiles = await readdir(dirname + filePath + "/");
        client.logger.log(`Loading a total of ${evtFiles.length} events.`, "category");
        evtFiles.forEach((file) => {
            const eventName = file.split(".")[0];
            client.logger.log(`Loading Event: ${eventName}`, "load");
            const event = new (require(dirname + filePath + `/${file}`))(client);
            client.on(eventName, (...args) => event.run(...args));
            delete require.cache[require.resolve(dirname + filePath + `/${file}`)];
        })
    };
    async server(client, filePath, dirname) {
        const evtFiles = await readdir(dirname + filePath + "/");
        client.logger.log(`Loading a total of ${evtFiles.length} events.`, "category");
        evtFiles.forEach((file) => {
            const eventName = file.split(".")[0];
            client.logger.log(`Loading Event: ${eventName}`, "load");
            const event = new (require(dirname + filePath + `/${file}`))(client);
            client.extention.on(eventName, (...args) => event.run(...args));
            delete require.cache[require.resolve(dirname + filePath + `/${file}`)];
        })
    };
}
module.exports = Initialize;