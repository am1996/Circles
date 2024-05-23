const express = require("express");
const controllers = require("../controllers/userController");
const userValidators = require("../validators/userValidators");
const jwtAuthenticateMiddleware = require("../middlewares/JWTAuthenticateMiddleware");
const router = express.Router();

router.post("/login",userValidators.loginUserValidator,controllers.login);
router.post("/register",userValidators.registerUserValidator,controllers.register);
router.post("/refreshToken",controllers.refreshtoken);

//user middleware on these only
router.use(jwtAuthenticateMiddleware);
router.get("/search",controllers.searchUser);
router.get("/",controllers.getUser);
router.get("/logout",controllers.logout);
router.post("/changeemail",userValidators.changeEmailValidator,controllers.changeEmail);
router.post("/changefullname",userValidators.changeFullnameValidator,controllers.changeFullname);
router.post("/changepassword",userValidators.changePasswordValidator,controllers.changePassword);
router.get("/follow/:id",controllers.followUser);
router.get("/:id",controllers.getUserById);
module.exports = router;