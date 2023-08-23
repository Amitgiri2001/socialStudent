const express = require('express');
const router = express.Router();

const commentController = require('../controllers/comment');

router.post('/post/:postId', commentController.postComment);


module.exports = router;