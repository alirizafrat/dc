const { Client, Collection } = require('discord.js');
const FileSync = require('lowdb/adapters/FileSync');
const { EventEmitter } = require('events');
require('dotenv').config({ path: __dirname + '/../.env' });
class Tantoony extends Client {
    constructor(options, name) {
        super(options);
        this.name = name;
        this.asToken = require("../BASE/config.json")[name]
        this.config = require('../HELPERS/config');
        this.logger = require("../HELPERS/logger");
        this.functions = require("../HELPERS/functions");
        this.extention = new EventEmitter();
        this.adapters = file => new FileSync(`../../BASE/_${file}.json`);
        this.mongoLogin();

        this.responders = new Collection();

        this.leaves = new Map();
        this.deleteChnl = new Map();
        this.invites = new Object();
        this.spamwait = new Map();
        this.spamcounts = new Object();
        this.trollwait = new Object();
        this.trollcounts = new Object();
        this.stats = new Object();
        this.banlimit = new Object();
        this.voicecutLimit = new Object();

        this.handler = new (require('../HELPERS/initialize'))(this);
    };

    mongoLogin() {
        require('mongoose').connect(`mongodb://${process.env.ipadress}:${process.env.port}`, {
            user: this.client.config.username,
            pass: process.env.mongoDB,
            dbName: this.client.config.mongoDB,
            authSource: this.client.config.auth
        }).then(() => {
            this.client.logger.log("Connected to the Mongodb database.", "mngdb");
        }).catch((err) => {
            this.client.logger.log("Unable to connect to the Mongodb database. Error: " + err, "error");
        });
    }

    getPath(obj, value, path) {

        if (typeof obj !== 'object') {
            return;
        }

        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                var t = path;
                var v = obj[key];
                if (!path) {
                    path = key;
                }
                else {
                    path = path + '.' + key;
                }
                if (v === value) {
                    return path.toString();
                }
                else if (typeof v !== 'object') {
                    path = t;
                };
                var res = this.getPath(v, value, path);
                if (res) {
                    return res;
                }
            }
        };
    }

    load_int(intName, intType) {
        try {
            const props = new (require(`../BOTS/${this.name}/${intType}/${intName}`))(this);
            this.logger.log(`Loading "${intType}" Integration in ${this.name}: ${props.info.name} 👌`, "load");
            if (props.init) {
                props.init(this);
            }
            this.responders.set(`${intType}:${props.info.name}`, props);
            return false;
        } catch (e) {
            return `Unable to load "${intType}" Integration ${intName}: ${e}`;
        }
    }

    async unload_int(intName, intType) {
        let ress;
        if (this.responders.has(intType + ":" + intName)) {
            ress = this.responders.get(intType + ":" + intName);
        }
        if (!ress) {
            return `The command \`${intName}\` doesn't seem to exist, nor is it an alias. Try again!`;
        }
        if (ress.shutdown) {
            await ress.shutdown(this);
        }
        delete require.cache[require.resolve(`../BOTS/${this.name}/${intType}/${intName}.js`)];
        return false;
    }


}
module.exports = Tantoony;
