const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);

// Flow Reset Password
router.post("/forgot-password", authController.forgotPassword); // Request OTP
router.post("/reset-password", authController.resetPassword); // Input OTP & New Pass

router.post("/change-password", verifyToken, authController.changePassword);

module.exports = router;
