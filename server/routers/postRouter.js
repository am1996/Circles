const express = require("express");
const controllers = require("../controllers/postController");
const postValidators = require("../validators/postValidators");
const jwtAuthenticateMiddleware = require("../middlewares/JWTAuthenticateMiddleware");
const router = express.Router();

module.exports = router;