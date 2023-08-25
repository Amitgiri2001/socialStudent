const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    collegeName: {
        type: String,
    },
    departmentName: {
        type: String,
    },
    currentYear: {
        type: Number,
    },
    dateOfBirth: {
        type: Date,
    },
    imageUrl: {
        type: String,
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
});

const User = mongoose.model('User', userSchema);
module.exports = User;