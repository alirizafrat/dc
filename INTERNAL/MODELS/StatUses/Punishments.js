const mongoose = require('mongoose');
module.exports = mongoose.model('Punishments', new mongoose.Schema({
    _id: String,
    records: Array
}, { _id: false }));