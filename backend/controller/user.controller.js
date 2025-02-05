const User = require("../models/user.model");
const Container = require("../models/container.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signup = async (req, res) => {
    try {
        const { userName, email, password, gender } = req.body;
        // console.log("req body at signup: ",req.body)

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            userName,
            email,
            password: hashedPassword,
            gender,
        });

        await user.save();

        // Create a new container for the user
        const container = new Container({ userId: user._id, postIds: [] });
        await container.save();

        user.containerId = container._id;
        await user.save();

        res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("req body login: ",req.body);

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: true, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: true, message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updates = req.body;

        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });

        res.json({ success: true, user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
};


exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password"); // Exclude password

        if (!user) {
            return res.status(404).json({ error: true, message: "User not found" });
        }

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
};
