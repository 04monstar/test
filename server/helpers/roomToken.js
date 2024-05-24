const Jwt = require('jsonwebtoken');
require('dotenv').config()


// Function to generate a room token and set it as a cookie in the response
const generateRoomToken = (roomId, res) => {
    try {
        // Generate JWT token with roomId and userId as payload
        const token = Jwt.sign({ roomId }, process.env.ACCESSTOKEN, { expiresIn: '1d' });

        if (!token) {
            console.error('Error generating room token: Token is undefined');
            return false; // Indicate failure
        }

        // Set the token as a cookie in the response
        res.cookie('roomToken', token, {
            httpOnly: true,
            maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production' // Set to true in production
        });

        return token; // Return the generated token
    } catch (error) {
        console.error('Error generating room token:', error);
        return false; // Indicate failure
    }
};


const createRoomToken = (roomId, res) =>{
    try{
        const token = Jwt.sign({roomId},process.env.ACCESSTOKEN, {expiresIn:'7d'})
        if(!token){
            res.status(500).json({
                message:'Error generating room token'
            })
        }

         // Set the token as a cookie in the response
         res.cookie('roomToken', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production' // Set to true in production
        });

    }
    catch(err){
        res.status(500).json({
            message: 'Error creating room',
            Error:err.message
        })
    }
}
module.exports = createRoomToken;
module.exports = generateRoomToken;