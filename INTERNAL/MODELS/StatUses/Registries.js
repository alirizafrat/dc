const mongoose = require('mongoose');
module.exports = mongoose.model('Registries', new mongoose.Schema({
    _id: String,
    records: Array
}, { _id: false }));