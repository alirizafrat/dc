const mongoose = require('mongoose');
module.exports = mongoose.model('Entry', new mongoose.Schema({
    _id: String,
    created: Date,
    type: String,
    channelID: String,
    selfMute: Boolean,
    serverMute: Boolean,
    selfDeaf: Boolean,
    serverDeaf: Boolean,
    selfVideo: Boolean,
    streaming: Boolean
}, { _id: false }));