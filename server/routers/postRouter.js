const express = require("express");
const controllers = require("../controllers/postController");
const postValidators = require("../validators/postValidators");
const jwtAuthenticateMiddleware = require("../middlewares/JWTAuthenticateMiddleware");
const router = express.Router();

router.use(jwtAuthenticateMiddleware);
router.get("/",controllers.getPosts);
router.get("/user",controllers.getPostsOfUser);
router.get("/search",postValidators.postValidator,controllers.searchPost);
router.post("/add",postValidators.postValidator,controllers.addPost);
router.post("/delete/:id",controllers.deletePost);
router.get("/like/:id",controllers.likePost);
router.get("/:id",controllers.getPost);
module.exports = router;