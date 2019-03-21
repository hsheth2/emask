const mongoose = require('mongoose');

const maskSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true,
    },
    description: String,
    address: {
        type: String,
        unique: true,
        required: true,
    },
    blocked: {
        type: Boolean,
        default: false,
    },
});

const Mask = mongoose.model('Mask', maskSchema);

module.exports = Mask;