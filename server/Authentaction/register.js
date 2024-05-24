const User = require('../models/userInfo')
const OTP = require('../models/otp')
const {hashed} = require('../helpers/hashedPassword')
const { sendOtp, generateOtp } = require('../helpers/sendOtp')

const register = async (req, res) => {
    const { first_name, last_name, email, password, profile } = req.body

    try {
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        //hashed Password 
        const hashPass = await hashed(password)

        const user = await User.create({
            first_name,
            last_name,
            email,
            password: hashPass,
            profile
        })

        //generate OTP 
        const otp = await generateOtp()

        //send OTP
        const subject = 'Otp Verification';
        const body = `Your OTP for registration is: ${otp}, your email_id is ${email}, your passWord is ${password}`;
        await sendOtp(email, subject, body);

      // Save OTP to the database
      const token = await new OTP({
        userId: user.id,
        token: otp
    }).save();

    const url = process.env.BASE_URL

        res.status(201).json({ message: "User data registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = register
