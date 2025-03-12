const jwt = require('jsonwebtoken');

// Middleware to check for valid JWT
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Get token from headers

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // Add user information to request
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error('Token verification error:', err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = auth;
