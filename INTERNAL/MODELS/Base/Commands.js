const mongoose = require('mongoose');
module.exports = mongoose.model('Command', new mongoose.Schema({
    _id: String,
    name: String,
    description: String,
    usage: String,
    examples: Array,
    category: String,
    aliases: Array,
    cmdChannel: String,
    accaptedPerms: Array,
    cooldown: Number,
    enabled: Boolean,
    ownerOnly: Boolean,
    rootOnly: Boolean,
    onTest: Boolean,
    adminOnly: Boolean,
    dmCmd: Boolean
}, { _id: false }));