const mongoose = require('mongoose');
module.exports = mongoose.model('member', new mongoose.Schema({
    _id: String,
    name: String,
    age: Number,
    sex: String,
    roles: Array,
    claimer: String,
    bringer: String,
    created: Date,
    invites: Array,
    records: Array,
    stats: Array,
    messages: Array,
    tag_claims: Array,
    co_bringers: Array
}, { _id: false }));