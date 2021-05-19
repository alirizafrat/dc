const mongoose = require('mongoose');
module.exports = mongoose.model('cMute', new mongoose.Schema({
    _id: String,
    reason: String,
    executor: String,
    duration: Number,
    created: Date
}, { _id: false }));