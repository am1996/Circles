require('dotenv').config();
let asecret = process.env.SECRET_KEY;
let rsecret = process.env.REFRESH_KEY;
const jwt = require("jsonwebtoken");

function generateAccessTokens(id,email){
}
function verifyToken(token,key){
}

module.exports = {generateAccessTokens,verifyToken};