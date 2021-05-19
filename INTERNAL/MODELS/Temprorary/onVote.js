const mongoose = require('mongoose');
module.exports = mongoose.model('onVote', new mongoose.Schema({
    _id: String,
    cID: String,
    upvotes: Array,
    downvotes: Array,
    created: Date
}, { _id: false }));