const express = require("express");
const {
    createPost,
    updatePost,
    deletePost,
    increaseLike,
    removeLike,
    addComment,
    deleteComment,
    getEveryPost,
    getAllComments,
    getUserPosts
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
router.get("/", authMiddleware, getEveryPost);
router.get("/:postId/comments", authMiddleware, getAllComments);
router.get("/user/:userId", authMiddleware, getUserPosts);

module.exports = router;