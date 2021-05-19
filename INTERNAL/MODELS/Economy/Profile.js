const mongoose = require('mongoose');
module.exports = mongoose.model('Profile', new mongoose.Schema({
    _id: String,
    coin: Number,
    badges: Array,
    xp: Number,
    Level: String,
    created: Date
}, { _id: false }));