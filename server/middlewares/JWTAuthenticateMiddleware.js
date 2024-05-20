require('dotenv').config();
const User = require('../models/User');
const Utils = require("../Utils/JWTUtils");

async function verifyAccessToken(req, res, next) {
}
module.exports = verifyAccessToken;