const express = require('express');
const { body } = require("express-validator");

//check authentication
const isAuth = require('../middleware/is-auth')

//multer code
const multer = require('multer');


// Define the allowed file extensions
const allowedFileExtensions = ['.jpg', '.jpeg', '.png'];

// Configure multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = file.originalname.split('.').pop();
        const filenameWithExtension = file.fieldname + '-' + uniqueSuffix + '.' + fileExtension;
        cb(null, filenameWithExtension);
    }
});
fileFilter = (req, file, cb) => {
    const isValidFileExtension = allowedFileExtensions.includes('.' + file.originalname.split('.').pop());
    if (isValidFileExtension) {
        cb(null, true); // Allow the file
    } else {
        cb(new Error('Invalid file type. Only JPG, JPEG, and PNG files are allowed.'));
    }
}

const upload = multer({
    storage: storage,
    //for filtering file types->variable 
    fileFilter: fileFilter,

});

const feedController = require('../controllers/feed');
const commentRouter = require('../routes/comment');

const router = express.Router();

//some validation
let validations = [body('title').trim().isLength({ min: 8 }),
body('content').trim().isLength({ min: 5 })];

// router.get('/posts', feedController.deleteAllPosts);
// router.get('/posts', feedController.deleteUnwantedImage);

// GET /feed/posts
router.get('/posts', isAuth, feedController.getPosts);

// POST /feed/post
router.post('/post', isAuth, upload.single('image'), validations, feedController.createPost);

//GET /feed/post/:postId
router.get('/post/:postId', feedController.getPostById);

//PUt /feed/post/:postId
router.put('/post/:postId', isAuth, upload.single('image'), validations, feedController.updatePost);

//Comment routes
router.use('/post/comment', commentRouter);

//DELETE /feed/post/:postId
router.delete('/post/:postId', isAuth, feedController.deletePostById);

module.exports = router;