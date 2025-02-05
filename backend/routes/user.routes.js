const express = require("express");
const { signup, login, updateProfile ,getProfile } = require("../controller/user.controller");
const { authMiddleware } = require("../middleware/middleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile",authMiddleware,getProfile);
router.put("/updateProfile", authMiddleware, updateProfile);

module.exports = router;
