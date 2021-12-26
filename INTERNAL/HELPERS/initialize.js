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
        const elements = await readdir(__dirname + `/../BOTS/${this.client.name}/Events/`);
        this.client.logger.log(`Loading ${elements.length} events in ${this.client.name}...`, "category");
        elements.forEach(async (element) => {
            if (element.endsWith(".js")) {
                this.client.logger.log(`Loading Event: ${element.split(".")[0]}`, "load");
                const event = new (require(__dirname + `/../BOTS/${this.client.name}/Events/${element}`))(this.client);
                this.client.on(element.split(".")[0], (...args) => event.run(...args));
                delete require.cache[require.resolve(__dirname + `/../BOTS/${this.client.name}/Events/${element}`)];
            } else {
                const detaileds = await readdir(__dirname + `/../BOTS/${this.client.name}/Events/${element}/`);
                this.client.logger.log(`Loading ${detaileds.length} details of the event ${element} in ${this.client.name}...`, "category");
                detaileds.forEach((detail) => {
                    this.client.logger.log(`Loading Event: ${detail.split(".")[0]}`, "load");
                    const event = new (require(__dirname + `/../BOTS/${this.client.name}/Events/${element}/${detail}`))(this.client);
                    this.client.on(element.split(".")[0], (...args) => event.run(...args));
                    delete require.cache[require.resolve(__dirname + `/../BOTS/${this.client.name}/Events/${element}/${detail}`)];
                });
            }
        });
    }

    async app_cmd() {
        const appFolders = await readdir(__dirname + `/../BOTS/${this.client.name}/app/`);
        appFolders.forEach(async (intType) => {
            readdir(__dirname + `/../BOTS/${this.client.name}/app/${intType}/`).then((raw_output) => {
                raw_output.filter((s) => s.endsWith('.js')).map(s => s.slice(0, s.length - ".js".length)).forEach((output) => {
                    const response = this.client.load_int(output, intType);
                    if (response) {
                        this.client.logger.log(response, "error");
                    }
                });
            });
        });
    }

    async project_events() {
        let raw_events = await readdir(__dirname + '/../EVENTS/');
        raw_events.forEach((file) => {
            this.client.logger.log("loading event: " + file, "load");
            const event = new (require(__dirname + "/../EVENTS/" + file))(this.client);
            this.client.extention.on(eventName, (...args) => event.run(...args));
            delete require.cache[require.resolve(__dirname + "/../EVENTS/" + file)];
        });
    }

}

module.exports = Initialize;
