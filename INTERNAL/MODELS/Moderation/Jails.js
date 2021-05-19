const mongoose = require('mongoose');
module.exports = mongoose.model('Jail', new mongoose.Schema({
    _id: String,
    executor: String,
    reason: String,
    roles: Array,
    type: String,
    duration: Number,
    created: Date
}, { _id: false }));