const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    description: {
        type: String,
        required: false
    },
    priority: {
        type: String,
        required: false
    },
    state: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Item', itemSchema);