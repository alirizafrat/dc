const mongoose = require('mongoose');
module.exports = mongoose.model('Badge', new mongoose.Schema({
    _id: String,
    name: String,
    emoji: String,
    cost: Number
}, { _id: false }));