const mongoose = require('mongoose');
module.exports = {
    afk = mongoose.model('afk', new mongoose.Schema({
        _id: String,
        reason: String,
        created: Date,
        inbox: Array
    }, { _id: false })),
    bc_cat = mongoose.model('backup_cc', new mongoose.Schema({
        _id: String,
        name: String,
        position: Number
    }, { _id: false })),
    bc_ovrts = mongoose.model('backup_overwrite', new mongoose.Schema({
        _id: String,
        overwrites: Array
    }, { _id: false })),
    bc_role = mongoose.model('backup_role', new mongoose.Schema({
        _id: String,
        name: String,
        color: String,
        hoist: Boolean,
        mentionable: Boolean,
        rawPosition: Number,
        bitfield: Number
    }, { _id: false })),
    bc_text = mongoose.model('backup_tc', new mongoose.Schema({
        _id: String,
        name: String,
        nsfw: Boolean,
        parentID: String,
        position: Number,
        rateLimit: Number
    }, { _id: false })),
    bc_voice = mongoose.model('backup_vc', new mongoose.Schema({
        _id: String,
        name: String,
        bitrate: Number,
        parentID: String,
        position: Number
    }, { _id: false })),
    mem_roles = mongoose.model('backup_member', new mongoose.Schema({
        _id: String,
        roles: Array
    }, { _id: false })),
    ban = mongoose.model('mod_ban', new mongoose.Schema({
        _id: String,
        executor: String,
        reason: String,
        type: String,
        duration: Number,
        created: Date
    }, { _id: false })),
    mute = mongoose.model('mod_mute', new mongoose.Schema({
        _id: String,
        type: Sring,
        reason: String,
        executor: String,
        duration: Number,
        created: Date
    }, { _id: false })),
    jail = mongoose.model('mod_jail', new mongoose.Schema({
        _id: String,
        executor: String,
        reason: String,
        roles: Array,
        type: String,
        duration: Number,
        created: Date
    }, { _id: false })),
}