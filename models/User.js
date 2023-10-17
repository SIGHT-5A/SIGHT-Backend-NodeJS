const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: Number,
        unique: true,
        default: null
    },
    NotificationChannel: {
        type: String,
        required: true,
    },
    avatarBg: {
        type: String,
        required: true,
    },
    avatarColor: {
        type: String,
        required: true,
    },
    avatarId: {
        type: Number,
        required: true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
