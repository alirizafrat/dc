const mongoose = require('mongoose');
module.exports = mongoose.model('Overwrites', new mongoose.Schema({
    _id: String,
    overwrites: Array
}, { _id: false }));