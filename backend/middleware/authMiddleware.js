const jwt = require('jsonwebtoken');

// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Ensure token is correctly extracted

    if (!token) {
        return res.status(401).json({ msg: 'Unauthorized, no token provided' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the decoded token contains a user object with a role
        if (!decoded.user || decoded.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied, not an admin' });
        }

        req.user = decoded.user; // Attach the user info to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error('Token verification failed:', err.message);
        return res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = isAdmin;
