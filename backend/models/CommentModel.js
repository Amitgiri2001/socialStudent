const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    content: {
        type: String,
    }
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;