const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Get token from request headers or cookies
    const token = req.headers.authorization || req.cookies.jwt;

    // Check if token exists
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user ID to request object for further use
        req.userId = decoded.userId;

        // Proceed to next middleware or route handler
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
};

module.exports = authMiddleware;
