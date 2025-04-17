const bcrypt = require("bcryptjs");
const User = require("../models/userSignModel.js");
const generateToken = require("../utills/generateToken.js");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
    },
});
const signin = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("Received:", req.body);


        const user = await User.findOne({ username }).select("+password");
        console.log("Found User:", user);

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        if (!user.password) {
            console.error("Password is missing in the database");
            return res.status(500).json({ message: "Server error: Password not stored correctly" });
        }

        // Corrected password comparison
        console.log(password)
        console.log(user.password)
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password Match:", isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        if (!user.isEmailVerified) {
            return res.status(400).json({ message: "Email not verified. Please verify your email." });
        }

      
        const token = generateToken(user); // Corrected function call
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                role: user.role,
                bio: user.bio,
                profilePic: user.profilePic
            }
        });
    } catch (error) {
        console.error("Sign-in Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate OTP and expiry time
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 300000; // OTP expires in 5 minutes
        await user.save();

        // Send OTP via email
        await transporter.sendMail({
            from: "your-email@gmail.com",
            to: user.email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is: ${otp}. It will expire in 5 minutes.`,
        });

        res.status(200).json({ message: "OTP sent to your email" });

    } catch (error) {
        console.error("Error sending OTP:", error); // Log the full error
        res.status(500).json({ message: "Error sending OTP", error: error.message || error });
    }
};


const changePassword = async (req, res) => {
   
    try {
        const {id}=req.params;
        const {otp}=req.body
       
  
       
          const user=await User.findOne({_id:id});
         if (user.otp !== otp ) {
           return res.status(400).json({ message: "Invalid or expired OTP" });
         }
          else{
                return  res.status(201).json({status:401,massage:"user otp varify!!"})
          }
      }
      catch (error) {
          console.error("invalid ",error)
          return  res.status(401).json({message:error.message})
      }
};

const resetPassword=async(req,res)=>{
    try {
        const {id}=req.params;
        const {  newPassword,confirmPassword } = req.body;
        if (newPassword !== confirmPassword) {
            res.status(400).send("Passwords do not match"); 
          }
    
          if(!newPassword){
            return res.status(400).json({ message: "password is required field" });
          }
        const user = await User.findOne({_id:id});

        if (!user) {
            return res.status(400).json({ message: "user not found !!" });
        }

      

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Your password has been successfully reset!" });

    } catch (error) {
        res.status(500).json({ message: "Error resetting password", error });
    }
}

module.exports = {
     signin,
     forgotPassword,
     changePassword,
     resetPassword

};
