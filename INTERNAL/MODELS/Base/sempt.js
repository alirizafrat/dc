const mongoose = require('mongoose');
module.exports = mongoose.model('sempt', new mongoose.Schema({
    _id: String,
    created: Date,
    executor: String,
    target: String,
    holded: Boolean
}, { _id: false }));