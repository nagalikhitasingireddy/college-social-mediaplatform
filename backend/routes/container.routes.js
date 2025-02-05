const express = require("express");
const { getAllPosts, addPost, removePost } = require("../controller/container.controller");
const { authMiddleware } = require("../middleware/middleware");

const router = express.Router();

router.get("/posts", authMiddleware, getAllPosts);
router.post("/addPost", authMiddleware, addPost);
router.delete("/removePost/:postId", authMiddleware, removePost);

module.exports = router;
