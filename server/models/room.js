const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    host: {
        type: String,
        required: true
    },
    roomId: {
        type: String,
        required: true,
        unique:true
    },
    roomBio:{
        type: String,
    },
    emails:[{
       type:String,
    }],
    participants: [{
        user: {
            type:String,
            required: true
        },
        joinTime: {
            type: [Date], 
            default: [Date.now()] 
        },
        joinCount: {
            type: Number,
            default: [] 
        },
        leaveTime: {
            type: [Date], 
            default: []
        },
        leaveCount: {
            type: Number,
            default: 0
        }
    }],
    roomType: {
        type: String,
        required: true
    },
    createTime:{
        type: Date,
        default: Date.now
    }
});

const Room = mongoose.model('UserRoom', roomSchema);

module.exports = Room