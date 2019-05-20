const mongoose = require('mongoose');

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
    email: { // TODO add validation here
        type: String,
        required: true,
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;
