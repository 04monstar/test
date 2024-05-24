const Room = require('../models/room');
const { generateRoomId } = require('../helpers/roomId');
const createRoomToken = require('../helpers/roomToken')
const { sendOtp } = require('../helpers/sendOtp');

// Function to create a new room
const roomCreated = async (req, res) => {
    try {
        const { host, roomType, roomBio, emails } = req.body;

        // Generate random room id
        const roomId = generateRoomId();

        // Check if room exists
        const roomExist = await Room.findOne({ roomId });
        if (roomExist) {
            return res.status(500).json({
                message: "Room already exists"
            });
        }

        // token for room
        // const roomToken = createRoomToken(roomId);

        // Create new room
        const newRoom = await Room.create({
            host,
            roomId,   
            roomType,
            roomBio,
            emails
        });

        // Save the new room
        await newRoom.save();

        // Send room id
        const subject = 'send room id';
        const body = `your room id is ${roomId}`;
        await sendOtp(emails, subject, body);

        // Return success response
        res.status(200).json({
            message: "Room created successfully",
            newRoom,  
        });
    } catch (err) {
        // Return error response
        res.status(500).json({
            Error: err.message
            
        });
    }
};


module.exports = {
    roomCreated,
};
