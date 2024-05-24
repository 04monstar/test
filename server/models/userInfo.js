const mongoose = require('mongoose')


const UserSchema  = new mongoose.Schema({
   first_name:{
    type:String,
        require:true
   },
   last_name:{
    type:String,
        require:true
   },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
    },
    profile:{
        type:String,
        require:true
    },
    verified: {
        type: Boolean,
        default: false
    },
    loginActivity: [{
        timestamp: {
            type: Date,
            default: Date.now
        },
        ipAddress: String,
        userAgent: String,
        action:{
            type : String,
            enum:['login','logout'],
            require:true
        }
    }],
})
const User = mongoose.model('User',UserSchema)

module.exports = User