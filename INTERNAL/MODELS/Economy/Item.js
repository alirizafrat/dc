const mongoose = require('mongoose');
module.exports = mongoose.model('Items', new mongoose.Schema({
    _id: String,
    name: String,
    cost: Number,
    allowedFor: Array,
    deniedFor: Array,
    stock: Array,
    created: Date
}, { _id: false }));