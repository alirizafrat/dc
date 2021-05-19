const mongoose = require('mongoose');
module.exports = mongoose.model('MemberRoles', new mongoose.Schema({
    _id: String,
    roles: Array
}, { _id: false }));