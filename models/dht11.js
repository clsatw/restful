const mongoose = require('mongoose');

const thisModel = new mongoose.Schema({
    t: {
        type: String,
        required: true,
        unique: true    // to save sapce if no change.
    },
    h: {
        type: String,
        required: true,
        unique: true
    },
    time: {
        type: Date,
        default: new Date().toLocaleString(),
    }
});
// declare a model called Prod which has schema thisSchema
module.exports = mongoose.model('Dht11', thisModel);