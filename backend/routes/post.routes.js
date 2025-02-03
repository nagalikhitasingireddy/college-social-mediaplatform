const express = require("express");
const {
    createPost,
    updatePost,
    deletePost,
    increaseLike,
    removeLike,
    addComment,
    deleteComment
} = require("../controller/post.controller");
const { authMiddleware } = require("../middleware/middleware");

const router = express.Router();

router.post("/", authMiddleware, createPost);
router.put("/:postId", authMiddleware, updatePost);
router.delete("/:postId", authMiddleware, deletePost);
router.post("/:postId/like", authMiddleware, increaseLike);
router.delete("/:postId/like", authMiddleware, removeLike);
router.post("/:postId/comment", authMiddleware, addComment);
router.delete("/:postId/comment/:commentId", authMiddleware, deleteComment);

module.exports = router;
