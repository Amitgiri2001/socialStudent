const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        //headers from frontend request
        const authHeader = req.get('Authorization');
        if (!authHeader) {
            const error = new Error('Not Authenticated');
            error.statusCode = 401;
            throw error;
        }

        const token = authHeader.split(' ')[1];
        // console.log("Token in is-auth: ", token);

        const decodedToken = jwt.verify(token, 'amitsSecret');
        // console.log("Token in decode: ", decodedToken);

        req.userId = decodedToken.userId;
        next();
    } catch (error) {
        const errorMessage = error.message || 'Not Authenticated';
        const statusCode = error.statusCode || 401;
        return res.status(statusCode).json({ message: errorMessage });
    }
};
