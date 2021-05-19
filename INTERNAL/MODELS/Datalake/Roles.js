const mongoose = require('mongoose');
module.exports = mongoose.model('roles', new mongoose.Schema({
    _id: String,
    name: String,
    color: String,
    hoist: Boolean,
    mentionable: Boolean,
    position: Number,
    bitfield: Number
}, { _id: false }));