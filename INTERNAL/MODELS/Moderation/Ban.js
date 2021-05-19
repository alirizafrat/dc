const mongoose = require('mongoose');
module.exports = mongoose.model('Ban', new mongoose.Schema({
    _id: String,
    executor: String,
    reason: String,
    type: String,
    duration: Number,
    created: Date
}, { _id: false }));