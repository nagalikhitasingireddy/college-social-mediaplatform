const Post = require("../models/post.model");

exports.createPost = async (req, res) => {
    try {
        const post = new Post({ ...req.body, userId: req.user.id });
        await post.save();
        res.status(201).json({ success: true, post });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.postId, req.body, { new: true });
        res.json({ success: true, post: updatedPost });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.postId);
        res.json({ success: true, message: "Post deleted" });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
};

exports.increaseLike = async (req, res) => {
    await Post.findByIdAndUpdate(req.params.postId, { $inc: { likes: 1 } });
    res.json({ success: true });
};

exports.removeLike = async (req, res) => {
    await Post.findByIdAndUpdate(req.params.postId, { $inc: { likes: -1 } });
    res.json({ success: true });
};

exports.addComment = async (req, res) => {
    await Post.findByIdAndUpdate(req.params.postId, { $push: { comments: { text: req.body.text } } });
    res.json({ success: true });
};

exports.deleteComment = async (req, res) => {
    await Post.findByIdAndUpdate(req.params.postId, { $pull: { comments: { _id: req.params.commentId } } });
    res.json({ success: true });
};
