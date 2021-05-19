const mongoose = require('mongoose');
module.exports = mongoose.model('Permited', new mongoose.Schema({
    _id: String,
    claim: String,
    request: String,
    created: Date
}, { _id: false }));