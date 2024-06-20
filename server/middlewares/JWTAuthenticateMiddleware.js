require('dotenv').config();
const User = require('../models/User');
const Utils = require("../Utils/JWTUtils");
async function verifyAccessToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = Utils.verifyToken(token, "access");
        let user = await User.findOne({accesstoken: token});
        if(user){
            req.user = decoded;
            next();
        }else{
            return res.status(403).json({ Error: 'You are not currently logged in!' });
        }
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ Error: 'Access token expired. Use refresh token to get a new one' });
        }
        return res.status(403).json({ Error: 'Invalid access token' });
    }
}
module.exports = verifyAccessToken;