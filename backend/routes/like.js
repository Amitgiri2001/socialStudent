const express = require('express');
const router = express.Router();
const likeController = require('../controllers/like');


router.post('/:postId', likeController.incrementLikes)


module.exports = router;