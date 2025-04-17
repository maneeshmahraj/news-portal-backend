const User = require("../models/userSignModel");
const emailService = require("../config/emailService");


// Generate OTP function
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP to email
exports.sendEmailOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Generate OTP
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

        // Update user with OTP
        await User.updateOne({ email }, { otp, otpExpires });

        // Send OTP email
        const emailSent = await emailService.sendOTP(email, otp);
        if (!emailSent) throw new Error("Failed to send OTP");

        res.json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Email OTP Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//verify otp

exports.verifyEmailOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Find user and check OTP
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Update user as email verified
        await User.updateOne({ email }, { isEmailVerified: true, otp: null, otpExpires: null });

        res.json({ message: "Email verified successfully" });
    } catch (error) {
        console.error("Verify Email OTP Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
