const express = require('express')
const register = require('../Authentaction/register')
// const OtpProtection = require('../protection/otpProtection')
const { otpCollector } = require('../Authentaction/otpCollector')
const { login, logout } = require('../Authentaction/login')
const authMiddleware = require('../protection/authMiddleware')
const { roomCreated, getRoom, authenticateSocket } = require('../Room/roomCreated')
const userRoutes = express.Router()

// routes for user Authentictaion
userRoutes.post('/register',register) // for registration

userRoutes.post('/register/otp',otpCollector) // for otp

userRoutes.post('/login', login) // for login

userRoutes.post('/room', roomCreated) // room

userRoutes.post('/logout',logout) // for logout



module.exports = userRoutes