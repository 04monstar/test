const Jwt = require('jsonwebtoken');

const tokenAndCookie = (userId, res, clearCookies = false) => {
    try {
        // Generate JWT token
        const jwt = Jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

        if (!jwt) {
            console.error('Error generating token: Token is undefined');
            return false; // Indicate failure
        }

        // Set the token as a cookie in the response
        res.cookie('jwt', jwt, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production' // Set to true in production
        });

        return true; // Indicate success
    } catch (error) {
        console.error('Error generating token and setting cookie:', error);
        return false; // Indicate failure
    }

    
};

module.exports = tokenAndCookie;