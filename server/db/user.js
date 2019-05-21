const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: { // TODO we should not be storing passwords in plain text
        type: String,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: 'Email address is required',
        validate: [validator.isEmail, 'Invalid email address']
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;
