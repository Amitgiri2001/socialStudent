const User = require('../models/UserModel');
const Post = require('../models/PostModel');

exports.incrementLikes = async (req, res, next) => {
    //find the post using params
    //check if the likes array contains current user then remove it else add it

    const postId = req.params.postId;

    const post = await Post.findById(postId);
    if (!post) {
        throw new Error(`Could not found post with id ${postId}`);
    }

    const userId = req.body.userId;
    if (post.like.includes(userId)) {
        post.like.pull(userId);
    } else {
        post.like.push(userId);
    }

    await post.save();

    res.status(201).json({
        message: "Post likes successfully",
        likesCount: post.like.length,
        like: post.like
    });
}