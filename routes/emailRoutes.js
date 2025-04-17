const express = require("express");
const router = express.Router();
const emailController = require("../controllers/emailController");


router.post("/send-otp", emailController.sendEmailOTP);


router.post("/verify-otp", emailController.verifyEmailOTP);

module.exports = router;
