const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/userSignModel");
const emailService = require("../config/emailService");
const router = express.Router();

// User Signup
router.post("/signup", async (req, res) => {
    try {
        const { username, email, phone, password, confirmPassword, role } = req.body;
        //console.log(req.body)

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

        user = new User({
            username,
            email,
            phone,
            password: hashedPassword,
            role: role ? role.toUpperCase() : "USER",
            otp,
            otpExpires,
            isEmailVerified: false,
        });

        await user.save();
        const emailSent = await emailService.sendOTP(email, otp);
        if (!emailSent) throw new Error("Failed to send OTP");

        res.status(201).json({ message: "OTP sent to email for verification" });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

module.exports = router;
