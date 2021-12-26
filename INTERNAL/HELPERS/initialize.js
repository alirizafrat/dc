const fs = require('fs');
const util = require('util');
const readdir = util.promisify(fs.readdir);

class Initialize {
    constructor(client) {
        this.client = client;
        this.project_events();
        this.loader();
        this.app_cmd();
    }

    async loader() {
        const evtFiles = subdir ? await readdir(dirname + filePath + `/${subdir}/`) : await readdir(dirname + filePath + '/');
        this.client.logger.log(`Loading a total of ${evtFiles.length} events.`, "category");
        if (!subdir) subdir = 'common';
        evtFiles.forEach((file) => {
            const eventName = file.split(".")[0];
            this.client.logger.log(`Loading Event: ${eventName}`, "load");
            const event = subdir !== 'common' ? new (require(dirname + filePath + `/${subdir}/${file}`))(this.client) : new (require(dirname + filePath + `/${file}`))(this.client);
            if (subdir === 'common') {
                this.client.extention.on(eventName, (...args) => event.run(...args));
                delete require.cache[require.resolve(dirname + filePath + `/${file}`)];
            } else {
                if (subdir === 'slash-events') creator.on(eventName, (...args) => event.run(...args));
                if (subdir === 'client-events') this.client.on(eventName, (...args) => event.run(...args));
                delete require.cache[require.resolve(dirname + filePath + `/${subdir}/${file}`)];
            }
        })
    };

    async softEvents(filePath, dirname) {
        const evtFiles = await readdir(dirname + filePath + "/");
        this.client.logger.log(`Loading a total of ${evtFiles.length} events.`, "category");
        evtFiles.forEach((file) => {
            const eventName = file.split(".")[0];
            this.client.logger.log(`Loading Event: ${eventName}`, "load");
            const event = new (require(dirname + filePath + `/${file}`))(this.client);
            this.client.on(eventName, (...args) => event.run(...args));
            delete require.cache[require.resolve(dirname + filePath + `/${file}`)];
        })
    };

    async app_cmd(dirname) {
        const appFolders = await readdir(dirname + "app/");
        appFolders.forEach(async (intType) => {
            readdir(`${dirname}app/${intType}/`).then((raw_output) => {
                raw_output.filter((s) => s.endsWith('.js')).map(s => s.slice(0, s.length - ".js".length)).forEach((output) => {
                    const response = this.client.load_int(output, intType);
                    if (response) {
                        this.client.logger.log(response, "error");
                    }
                });
            });

        })
    }

    async project_events() {
        let raw_events = await readdir(__dirname + '/../EVENTS/');
        raw_events.forEach((file) => {
            this.client.logger.log("loading event: " + file, "load");
            const event = new (require(__dirname + "/../EVENTS/" + file))(this.client);
            this.client.extention.on(eventName, (...args) => event.run(...args));
            delete require.cache[require.resolve(__dirname + "/../EVENTS/" + file)];
        })
    }

    async hardEvents(filePath, dirname) {
        let eventFolders = await readdir(dirname + filePath + "/");
        this.client.logger.log(`Loading a total of ${eventFolders.length} categories.`, "category");
        eventFolders.filter(dir => dir !== 'other').forEach(async (dir) => {
            let events = await readdir(dirname + filePath + "/" + dir + "/");
            events.filter((evnt) => evnt.split(".").pop() === "js").forEach((file) => {
                this.client.logger.log("loading event: " + file, "load");
                const event = new (require(`${dirname}/${filePath}/${dir}/${file}`))(this.client);
                this.client.on(dir, (...args) => event.run(...args));
                delete require.cache[require.resolve(`${dirname}/${filePath}/${dir}/${file}`)];
            });
        });
    }


}

module.exports = Initialize;
