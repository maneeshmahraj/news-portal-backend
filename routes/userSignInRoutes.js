const express = require("express");
const { signin,forgotPassword,changePassword,resetPassword} = require("../controllers/userSignInController");

const router = express.Router();

router.post("/signin", signin);
router.post("/forgot-password", forgotPassword);
router.post("/change-password/:id", changePassword);
router.post("/reset-password/:id",resetPassword)
module.exports = router;