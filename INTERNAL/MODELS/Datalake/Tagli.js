const mongoose = require('mongoose');
module.exports = mongoose.model('Tagli', new mongoose.Schema({
    _id: String,
    created: Date
}, { _id: false }));