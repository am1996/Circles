require('dotenv').config();
let asecret = process.env.SECRET_KEY;
let rsecret = process.env.REFRESH_KEY;
const jwt = require("jsonwebtoken");

function generateAccessTokens(id,username){
    let attl = 60*24*30;
    let rttl = 60*24*30;
    let accesstoken = jwt.sign({
        _id:id,
        username:username,
        iat: Date.now()
    },asecret,{
        expiresIn: attl
    });
    let refreshtoken = jwt.sign({
        _id:id,
        iat: Date.now()
    },rsecret,{
        expiresIn: rttl
    });
    return {accesstoken,refreshtoken};
}
function verifyToken(token,key){
    let secret = key =="refresh" ? rsecret: asecret;
    return jwt.verify(token, secret);
}

module.exports = {generateAccessTokens,verifyToken};