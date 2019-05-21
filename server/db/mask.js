const mongoose = require('mongoose');
const validator = require('validator');

const checkAddr = (addr) => {
    // We only need to check that addr forms a valid initial portion of an email. For simplicity,
    // we just tack on a known valid domain, example.com.
    const email = addr + '@example.com';
    return validator.isEmail(email);
};

const maskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
