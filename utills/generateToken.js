const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role }, // ✅ Consistent with database field names
        process.env.JWT_SECRET,
        { expiresIn: "7d" } // ✅ 7 days expiry
    );
};

module.exports = generateToken;
