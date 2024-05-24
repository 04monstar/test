const User = require('../models/userInfo');
const { comparePass } = require('../helpers/hashedPassword');
const tokenAndCookie = require('../helpers/tokenAndCookie');

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        const isMatch = await comparePass(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password'
            });
        }

        // Generate token and set cookie
        tokenAndCookie(user._id, res);

        // Record login activity
        const loginDetails = {
            timestamp: new Date(),
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            action: 'login'
        };
        user.loginActivity.push(loginDetails);

        // Save the user document
        await user.save();

        return res.status(200).json({
            status: 'success',
            message: 'Login successful'
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};

const logout = async (req, res) => {
    try {
        // Find the user by ID
        const user = await User.findOne({ _id: req.user._id }); // Assuming req.user._id is available

        // If user not found, return an error
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Record logout activity
        const logoutDetails = {
            timestamp: new Date(),
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            action: 'logout'
        };
        user.loginActivity.push(logoutDetails);

        // Clear the authentication token (if using JWT)
        res.clearCookie('jwt'); // Ensure 'jwt' matches the name of your cookie

        // Save the updated user document
        await user.save();

        // Return success response
        return res.status(200).json({
            status: 'success',
            message: 'Logout successful'
        });
    } catch (err) {
        // Handle any errors
        console.error('Error logging out:', err);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};

module.exports = {
    login,
    logout
};
