const { Client, Collection } = require('discord.js');
const FileSync = require('lowdb/adapters/FileSync');
const { EventEmitter } = require('events');
require('dotenv').config({ path: __dirname + '/.env' });

class Tantoony extends Client {
    constructor(options, name) {
        super(options);
        this.models = require('./db_models');
        this.config = require('../HELPERS/config');
        this.logger = require("../HELPERS/logger");
        this.functions = require("../HELPERS/functions");
        this.extention = new EventEmitter();
        this.name = name.startsWith('CD') ? this.config.vars.calm_down[name.split('_').pop()] : this.config.vars[name];
        this.adapters = file => new FileSync(`../../BASE/_${file}.json`);
        this.mongoLogin();
        this.login(process.env[this.config.vars[name]]);
        this.responders = new Collection();

        this.cmdCoodown = new Object();
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
        require('mongoose').connect(`mongodb://${process.env[this.config.mongoDB.env_key]}:${this.config.mongoDB.port}`, {
            user: this.config.mongoDB.user,
            pass: process.env.mongoDB,
            dbName: this.config.mongoDB.name,
            authSource: this.config.mongoDB.auth
        }).then(() => {
            this.logger.log("Connected to the Mongodb database.", "mngdb");
        }).catch((err) => {
            this.logger.log("Unable to connect to the Mongodb database. Error: " + err, "error");
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
