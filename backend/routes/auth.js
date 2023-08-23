const express = require('express');
const { body } = require('express-validator');
const User = require('../models/UserModel');
const auth = require('../controllers/auth');


const router = express.Router();

const validations =
    [
        body('email').isEmail().withMessage('Not a valid e-mail address').custom((value, { req }) => {
            return User.findOne({ email: value }).then(userDoc => {
                if (userDoc) {
                    throw new Error('E-mail already in use');
                }
            });

        }).normalizeEmail(),
        body('password').trim().isLength({ min: 8 }),
        body('name').trim().not().isEmpty()

    ]

router.put('/signup', validations, auth.signup);
router.post('/login', auth.login);


module.exports = router;
