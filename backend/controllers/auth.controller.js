import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import crypto from "crypto"; // Import crypto for token generation
import mailjet from "node-mailjet"; // Import Mailjet
import { ENV_VARS } from "../config/envVars.js";
// Configure Mailjet

const mailjetClient = mailjet.apiConnect(
  ENV_VARS.MAILJET_API_KEY,
  ENV_VARS.MAILJET_API_SECRET
);

export async function signup(req, res) {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUserByEmail = await User.findOne({ email: email });
    if (existingUserByEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const existingUserByUsername = await User.findOne({ username: username });
    if (existingUserByUsername) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const token = crypto.randomBytes(32).toString("hex"); // Generate a verification token

    const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];
    const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      image,
      verificationToken: token, // Add token to user model
      isVerified: false, // Add verification status
    });

    await newUser.save();

    // Send verification email
    const verificationLink = `https://upgraded-mern-stack-video-platform.onrender.com/api/v1/auth/verify-email?token=${token}`;

    // const verificationLink = `http://localhost:5000/api/v1/auth/verify-email?token=${token}`;

    await sendVerificationEmail(email, verificationLink);

    res.status(201).json({
      success: true,
      message: "Signup successful! Please verify your email.",
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// Function to send verification email
async function sendVerificationEmail(email, verificationLink) {
  const request = mailjetClient.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "naveenbeniwal00001@gmail.com",
          Name: "Mern Stack video platform",
        },
        To: [
          {
            Email: email,
          },
        ],
        Subject: "Email Verification",
        TextPart: `Please verify your email by clicking the link: ${verificationLink}`,
        HTMLPart: `<h3>Email Verification</h3><p>Please verify your email by clicking the link: <a href="${verificationLink}">${verificationLink}</a></p>`,
      },
    ],
  });

  return request
    .then((result) => {
      // console.log("Verification email sent:", result.body);
      console.log("Verification email sent");
    })
    .catch((err) => {
      console.error(
        "Error sending verification email:",
        err.statusCode,
        err.message
      );
    });
}
export async function verifyEmail(req, res) {
  try {
    const { token } = req.query; // Get the token from the query parameter

    // Find the user with the provided verification token
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token." });
    }

    user.isVerified = true; // Set verific
    // Update the user's verification statusation status to true
    user.verificationToken = null; // Clear the token
    await user.save();
    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      success: true,
      // message: "Email verified successfully! You can now log in.",
    });
  } catch (error) {
    console.log("Error in email verification", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function authCheck(req, res) {
  try {
    // console.log("req.user:", req.user);
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    console.log("Error in authCheck controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie("jwt-netflix");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email address before logging in.",
      });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      success: true,
      user: {
        ...user._doc,
        password: "",
      },
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
