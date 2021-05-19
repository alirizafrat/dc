const { Client, Collection } = require('discord.js');
const FileSync = require('lowdb/adapters/FileSync');
const events = require('events');
const path = require('path');

class Tantoony extends Client {
    constructor(options) {
        super(options);
        this.config = require('../../../HELPERS/config');
        this.logger = require("../../../HELPERS/logger");
        this.functions = require("../../../HELPERS/functions");
        this.handler = require('../../../HELPERS/initialize');

        this.commands = new Collection();
        this.aliases = new Collection();

        this.cmdCoodown = new Object();
        this.adapters = file => new FileSync(`../../BASE/_${file}.json`);
        this.models = file => new FileSync(`../../../MODELS/_${file}.json`);

        this.extention = new events.EventEmitter();
    }

    loadCommand(commandPath, commandName) {
        try {
            const props = new (require(`../${commandPath}${path.sep}${commandName}`))(this);
            this.logger.log(`Loading Command: ${props.info.name}. 👌`, "load");
            props.config.location = commandPath;
            if (props.init) {
                props.init(this);
            }
            this.commands.set(props.info.name, props);
            props.info.aliases.forEach((alias) => {
                this.aliases.set(alias, props.info.name);
            });
            return false;
        } catch (e) {
            return `Unable to load command ${commandName}: ${e}`;
        }
    }

    async unloadCommand(commandPath, commandName) {
        let command;
        if (this.commands.has(commandName)) {
            command = this.commands.get(commandName);
        } else if (this.aliases.has(commandName)) {
            command = this.commands.get(this.aliases.get(commandName));
        }
        if (!command) {
            return `The command \`${commandName}\` doesn't seem to exist, nor is it an alias. Try again!`;
        }
        if (command.shutdown) {
            await command.shutdown(this);
        }
        delete require.cache[require.resolve(`../${commandPath}${path.sep}${commandName}.js`)];
        return false;
    }
}
module.exports = Tantoony;