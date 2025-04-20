const jwt = require("jsonwebtoken");
const db = require("../db/models/index");
const {UnauthenticatedError} = require('../errors');
const { StatusCodes } = require('http-status-codes');
require("dotenv").config();
const authentication = async (req, res, next) => {


    let token;
    if ( req.cookies?.accessToken) {
        token = req.cookies.accessToken;
    }
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'No token provided' });
    }
    
    try {

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        const user = await db.Users.findOne({
          where: { id: decoded.userId },
          attributes: { exclude: ["password"] },
        });

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
        }
        req.user = user;
        
        next();

    } catch (err) {
        
        if (err.name === 'TokenExpiredError') {
            return res.status(StatusCodes.UNAUTHORIZED).json({
              message: 'Token expired',
              expired: true
            });
        }
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Invalid token'
        });
    }
}

module.exports = authentication;

