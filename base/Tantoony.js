const { Client, Collection } = require('discord.js');
const FileSync = require('lowdb/adapters/FileSync');
const { EventEmitter } = require('events');
const Lowdb = require('lowdb');

class Tantoony extends Client {
    constructor(options, name) {
        super(options);
        this.name = name;
        this.defaly = require('./class_types');
        this.models = require('./db_models');
        this.config = require('../HELPERS/config');
        this.logger = require("../HELPERS/logger");
        this.functions = require("../HELPERS/functions");
        this.extention = new EventEmitter();
        this.adapters = file => new FileSync(`../../BASE/_${file}.json`);
        (() => {
            require('dotenv').config({ path: __dirname + '/.env' });
            this.login(process.env[this.config.vars[name]]);
        })();
        this.mongoLogin();
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
        require('mongoose').connect(`mongodb://${process.env.mongo_pass}:${this.config.mongoDB.port}`, {
            user: this.config.mongoDB.user,
            pass: process.env.mongoDB,
            authSource: this.config.mongoDB.auth,
            dbName: this.config.mongoDB.name
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

    async load_int(intName, intType, client) {
        const roles = Lowdb(this.adapters('roles'));
        try {
            const props = new (require(`../SERVER/${this.name}/app/${intType}/${intName}`))(client, {}, client.guild, this.config.server);
            const cmd = await client.guild.commands.create(props, this.config.server);
            props.id = cmd.id;
            this.logger.log(`Loading "${intType}" Integration in ${this.name}: ${cmd.name} [${props.id}] 👌`, "load");
            client.responders.set(`${intType}:${cmd.name}`, props);
            client.guild.commands.permissions.set({
                command: cmd.id,
                permissions: props.permissions.map(p => {
                    p["id"] = roles.get("cmd-" + p.id).value() ||roles.get(p.id).value();
                    return p;
                })
            });
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
        delete require.cache[require.resolve(`../SERVER/${this.name}/app/${intType}/${intName}.js`)];
        return false;
    }

    async fetchEntry(action) {
        const entry = await this.client.guild.fetchAuditLogs({ type: action }).then((logs) => logs.entries.first());
        return entry;
    }

}
module.exports = Tantoony;
