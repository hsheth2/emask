const mongoose = require('mongoose');
const validator = require('validator');

const checkAddr = (addr) => {
    const email = addr + '@' + process.env.MAILGUN_DOMAIN;
    return validator.isEmail(email);
};

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
        lowercase: true,
        validate: [checkAddr, 'Invalid email address']
    },
    blocked: {
        type: Boolean,
        default: false,
    },
    // TODO email expiration
    // TODO emails forwarded counter
}, {timestamps: true});

const Mask = mongoose.model('Mask', maskSchema);

module.exports = Mask;
