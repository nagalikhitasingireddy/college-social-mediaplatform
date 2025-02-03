const Container = require("../models/container.model");
const Post = require("../models/post.model");

exports.getAllPosts = async (req, res) => {
    try {
        const container = await Container.findOne({ userId: req.user.id }).populate("postIds");

        if (!container) {
            return res.status(404).json({ error: true, message: "Container not found" });
        }

        res.json({ success: true, posts: container.postIds });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
};

exports.addPost = async (req, res) => {
    try {
        const { postId } = req.body;

        const container = await Container.findOneAndUpdate(
            { userId: req.user.id },
            { $push: { postIds: postId } },
            { new: true }
        );

        res.json({ success: true, container });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
};

exports.removePost = async (req, res) => {
    try {
        const { postId } = req.params;

        const container = await Container.findOneAndUpdate(
            { userId: req.user.id },
            { $pull: { postIds: postId } },
            { new: true }
        );

        res.json({ success: true, container });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
};
