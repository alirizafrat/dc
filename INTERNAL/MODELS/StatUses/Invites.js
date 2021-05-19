const mongoose = require('mongoose');
module.exports = mongoose.model('Invites', new mongoose.Schema({
    _id: String,
    records: Array
}, { _id: false }));