
const Comment = require('../models/CommentModel');
const Post = require('../models/PostModel');

exports.postComment = async (req, res, next) => {
    const content = req.body.content;
    //get the post id
    const postId = req.params.postId;

    //add the comment into the model
    const newComment = new Comment({
        content: content,
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