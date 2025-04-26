const db = require("../db/models/index")
const { BadRequestError, UnauthenticatedError,ForbiddenError , NotFoundError} = require('../errors');
require('dotenv').config();
const asyncWrapper = require("../middlewares/async")
const verifyOTP = asyncWrapper(async (req, res) => {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
        throw new BadRequestError('Please provide userId and otp');
    }
    
    const user = await db.Users.findOne({ where: { id: userId } });
    if (!user) {
        throw new NotFoundError('User not found');
    }
    if (user.isVerified) {
        throw new UnauthenticatedError('User is already verified');
    }
    
    if ( !user.otpCode || user.otpCode !== otp || new Date() > user.otpExpiresAt) {
        // throw new UnauthenticatedError('Invalid or expired OTP');
        res.json({message: 'invalid or expired otp'});
    }
    
    await user.update({ isVerified: true, otpCode: null, otpExpiresAt: null });
    
    const accessToken = await user.generateAccessToken();
    
    const refreshTokenDb = await db.refreshToken.generateToken(user.id);
    const refreshToken = refreshTokenDb.token;
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'Strict',
        maxAge: process.env.COOKIE_AGE, 
    });
    
    
    return res.status(200).json({
        msg: 'OTP verified successfully',
        accessToken,
    });

});
module.exports = { verifyOTP };


