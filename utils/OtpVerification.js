const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

//OTP
const sendOTP = async (user) => {
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpire = Date.now() + 10 * 60 * 1000;
    await user.update({ otpCode: otp, otpExpiresAt: otpExpire });

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'OTP for password reset',
        html: `
        <!DOCTYPE html>
        <html>
        <head>

        </head>
        <body>
        <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #333;">Password Reset OTP</h2>
            <p>Hello <strong>${user.firstname}</strong>,</p>
            <p>Your One-Time Password (OTP) for resetting your password is:</p>
            <h3 style="text-align: center; background-color: #f4f4f4; padding: 10px; border-radius: 5px;">${otp}</h3>
            <p>This OTP will expire in <strong>10 minutes</strong>.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <p>Best regards,<br>Serbili Team</p>
        </div>
        </body>
        </html>
    `,
    })
}

module.exports = { sendOTP };