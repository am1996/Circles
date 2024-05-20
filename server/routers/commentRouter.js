const express = require("express");
const controllers = require("../controllers/commentController");
const commentValidators = require("../validators/commentValidators");
const jwtAuthenticateMiddleware = require("../middlewares/JWTAuthenticateMiddleware");
const router = express.Router();

module.exports = router;