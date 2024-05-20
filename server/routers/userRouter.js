const express = require("express");
const controllers = require("../controllers/userController");
const userValidators = require("../validators/userValidators");
const jwtAuthenticateMiddleware = require("../middlewares/JWTAuthenticateMiddleware");
const router = express.Router();


module.exports = router;