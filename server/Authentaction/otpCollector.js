const OTP = require('../models/otp');
const User = require('../models/userInfo');

const otpCollector = async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        // Find the token by userId
        const token = await OTP.findOne({ userId: user._id });

        if (!token) {
            return res.status(404).json({
                error: 'OTP token not found'
            });
        }

        // Check if the provided OTP matches the saved OTP
        if (token.token !== otp) {
            return res.status(400).json({
                error: 'Invalid OTP'
            });
        }

        // Update user verification status to true
        user.verified = true;
        await user.save();

        res.status(200).json({
            message: 'OTP verified successfully'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
           Error:err.message
        });
    }
};

module.exports = {
    otpCollector
};
