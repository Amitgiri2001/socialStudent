
const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    creator: {
        //type is object of schema
        type: mongoose.Schema.Types.ObjectId,
        //reference is the User Model
        ref: 'User',
        required: true,
    },
    imageUrl: {
        type: String,
        required: true
    },
    like: [{
        //type is object of schema
        type: mongoose.Schema.Types.ObjectId,
        //reference is the User Model
        ref: 'User',
    }],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }

    ],


}, { timestamps: true });
//this timestamps is allocated to createdAt and updatedAt

const PostModel = mongoose.model('Post', PostSchema);

module.exports = PostModel;