const express = require("express");
const controllers = require("../controllers/commentController");
const commentValidators = require("../validators/commentValidators");
const jwtAuthenticateMiddleware = require("../middlewares/JWTAuthenticateMiddleware");
const router = express.Router();

router.use(jwtAuthenticateMiddleware);
router.get("/",controllers.getComments);
router.get("/user",controllers.getCommentsOfUser);
router.post("/add",commentValidators.commentValidator,controllers.addComment);
module.exports = router;