const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String,required: true },
    fullName: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true, select: true }, // Ensure this is hashed before saving
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    },
    isEmailVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
    bio: { type: String, default: "" },
    profilePic: { type: String, default: "" },
    isBlocked: { type: Boolean, default: false } // New field for blocking users

});

// Prevent model overwrite error
module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
