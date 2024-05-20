const express = require("express");
const userRouter = require("./routers/userRouter");
const postRouter = require("./routers/postRouter");
const commentRouter = require("./routers/commentRouter");
const router = express.Router();

router.use("/user",userRouter);
router.use("/post",postRouter);
router.use("/comment",commentRouter);

module.exports = router;