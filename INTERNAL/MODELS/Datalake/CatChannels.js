const mongoose = require('mongoose');
module.exports = mongoose.model('CategoryChannels', new mongoose.Schema({
    _id: String,
    name: String,
    position: Number
}, { _id: false }));