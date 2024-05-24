    const nodemailer = require('nodemailer');


    //generate otp
    const generateOtp = async(res,req)=>{
        try {
            // Generate a random six-digit OTP
            const otp = Math.floor(100000 + Math.random() * 900000);
            const formattedOtp = otp.toString().padStart(6, '0');
    
            return formattedOtp;
        } catch (error) {
            console.error('Error generating OTP:', error);
            throw error;
        }
    }

    // send otp
    const sendOtp = async (email, subject, text) => {
            try {
                const transporter = nodemailer.createTransport({
                    host: process.env.HOST,
                    service: process.env.SERVICE,
                    port:465,
                    secure:true,
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.PASSWORD
                    }
                });

                await transporter.sendMail({
                    from: process.env.EMAIL,
                    to: email,
                    subject: subject,
                    text: text
                });

                console.log("Email sent successfully");
            } catch (err) {
                console.log('Email not sent', err.message);
            }
        }


    module.exports = {
        sendOtp,
        generateOtp
    }