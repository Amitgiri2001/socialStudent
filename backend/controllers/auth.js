const { validationResult } = require('express-validator');
const User = require('../models/UserModel');

//web token while login
var jwt = require('jsonwebtoken');
//password validation with bcrypt
const bcrypt = require('bcryptjs');

exports.signup = (req, res, next) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.status(422).json({ errors: errors.array() });
    // }

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    bcrypt.hash(password, 12, (err, hash) => {
        const user = new User({
            name: name,
            password: hash,
            email: email
        });
        user.save().then(result => {
            res.status(200).json({ message: "New User created..", userId: result._id });
        })
            .catch((err) => { console.log("Error in pass salt") })
    })

}

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(422).json({ message: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            console.log("password mismatch");
            const error = new Error('Password mismatch');
            error.statusCode = 401;
            throw error;
        }

        // Create a token for 2 hours
        const token = jwt.sign(
            {
                email: user.email,
                userId: user._id.toString(),
            },
            'amitsSecret',
            { expiresIn: '2h' }
        );


        res.status(200).json({ token: token, userId: user._id.toString() });
    } catch (err) {
        console.log("Error in login:", err);
        next(err);
    }
};
