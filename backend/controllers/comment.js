
const Comment = require('../models/CommentModel');
const Post = require('../models/PostModel');
const User = require('../models/UserModel');

exports.postComment = async (req, res, next) => {
    const content = req.body.content;
    //get the post id
    const postId = req.params.postId;

    //the userId ->uncomment when call from frontend

    // const userId = req.userId;
    const userId = req.body.userId;

    //add the comment into the model
    const newComment = new Comment({
        content: content,
        user: userId,
    });
    // const post = await Post.findById(postId);

    newComment.save()
        .then(comment => {
            // Find the post you want to associate the comment with
            return Post.findById(postId); // Replace with an actual post ID
        })
        .then(post => {
            // Associate the comment with the post by pushing the comment's _id to the comments array
            post.comments.push(newComment._id);
            return post.save();
        })
        .then(updatedPost => {
            res.status(201).json({
                message: 'Comment created successfully!',
                comment: newComment,
                post: updatedPost
            });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({
                error: 'An error occurred.'
            });
        });
}

//get all comments of a post
exports.getAllComments = async (req, res, next) => {
    //find the post using postId
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    if (!post) {
        console.log('No post found');
        throw new Error('No post found');
    }

    const allCommentsIds = post.comments;
    let allComments = [];
    for (let i = 0; i < allCommentsIds.length; i++) {
        const comment = await Comment.findById(allCommentsIds[i]._id);
        if (!comment) {
            continue;
        }
        let user = await User.findById(comment.user);
        comment.user = user;

        allComments.push(comment);
    }

    res.status(200).json({
        message: 'all Comment fetched successfully!',
        comments: allComments,


    });
};

//update comment
exports.updateComment = async (req, res, next) => {
    //check if the comment user and the authorize user are same or not 
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
        throw new Error("Comment not found");
    }

    //userId get this data from frontend
    // const userId=req.userId;
    const userId = req.body.userId;
    console.log(userId + " " + comment.user.toString());
    if (userId !== comment.user.toString()) {
        throw new Error("You are not allowed to update others comment");
    }

    const newContent = req.body.content;
    comment.content = newContent;

    await comment.save();

    res.status(201).json({
        message: 'Comment updated successfully!',
        comment: comment,
    });
};
//delete comment
exports.deleteComment = async (req, res, next) => {
    //check if the comment user and the authorize user are same or not 
    const commentId = req.params.commentId;
    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new Error("Comment not found");
    }

    //userId get this data from frontend
    // const userId=req.userId;
    const userId = req.body.userId;
    const postId = req.body.postId;
    console.log(userId + " " + comment.user.toString());
    if (userId !== comment.user.toString()) {
        throw new Error("You are not allowed to update others comment");
    }

    await Comment.findByIdAndDelete(commentId);
    //i have to delete the comment from the post as well
    const post = await Post.findById(postId);

    if (!post) {
        throw new Error("Post not found");
    }
    console.log(commentId);
    await post.comments.pull(commentId);
    await post.save();

    res.status(201).json({
        message: 'Comment deleted successfully!',
    });
};