const express = require('express');
const router = express.Router();

const commentController = require('../controllers/comment');

router.post('/post/:postId', commentController.postComment);

//get all comments of a post
router.get('/post/:postId/comments', commentController.getAllComments);

//update one comment of a post
router.put('/post/comments/:commentId', commentController.updateComment);
//delete a comment of a post
router.delete('/post/comments/:commentId', commentController.deleteComment);

module.exports = router;