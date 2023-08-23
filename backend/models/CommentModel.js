const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    content: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;