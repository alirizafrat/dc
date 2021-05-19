const { Client } = require('discord.js');
const FileSync = require('lowdb/adapters/FileSync');
const events = require('events');
class Tantoony extends Client {
    constructor(options) {
        super(options);
        this.config = require('../HELPERS/config');
        this.logger = require("../HELPERS/logger");
        this.functions = require("../HELPERS/functions");
        this.language = require('../HELPERS/language');
        this.handler = require('../HELPERS/initialize');
        this.adapters = file => new FileSync(`../../BASE/_${file}.json`);
        this.models = file => new FileSync(`../../MODELS/_${file}.json`);
        //this.dashboard = require('../DashboardSample/app');
        this.invites = new Object();
        this.spamwait = new Map();
        this.spamcounts = new Object();
        this.trollwait = new Object();
        this.trollcounts = new Object();
        this.stats = new Object();

        this.extention = new events.EventEmitter();
    };
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
                if(res) {
                    return res;
                } 
            }
        };
    }
}
module.exports = Tantoony;