import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import crypto from "crypto";
import { sendVerificationEmail } from "../mailjet/emails.js";
import { ENV_VARS } from "../config/envVars.js";

const HOUR_IN_MS = 3600000; // 1 hour in milliseconds

// Helper function to generate a new verification token
const generateNewVerificationToken = async (user) => {
  user.verificationToken = crypto.randomBytes(32).toString("hex");
  // user.verificationTokenExpires = Date.now() + HOUR_IN_MS;
  user.verificationTokenExpires = new Date(Date.now() + HOUR_IN_MS);

  await user.save();

  // await user.save();
};

// Signup function
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

    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      if (!existingUserByEmail.isVerified) {
        if (
          !existingUserByEmail.verificationTokenExpires ||
          existingUserByEmail.verificationTokenExpires < Date.now()
        ) {
          // Clear expired token data
          existingUserByEmail.verificationToken = null;
          existingUserByEmail.verificationTokenExpires = null;

          // Generate a new token
          await generateNewVerificationToken(existingUserByEmail);

          const verificationLink = `${ENV_VARS.ACTIVE_LINK}/api/v1/auth/verify-email?token=${existingUserByEmail.verificationToken}`;
          await sendVerificationEmail(
            existingUserByEmail.email,
            verificationLink
          );

          return res.status(200).json({
            success: true,
            message: "Verification email sent again. Please check your inbox.",
          });
        }
        return res.status(400).json({
          success: false,
          message: "Email already exists. Please verify your email.",
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Email already exists and is verified.",
        });
      }
    }

    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const token = crypto.randomBytes(32).toString("hex");
    const expirationTime = new Date(Date.now() + HOUR_IN_MS); // Date.now() + HOUR_IN_MS;

    const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];
    const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      image,
      verificationToken: token,
      verificationTokenExpires: expirationTime,
      isVerified: false,
    });

    await newUser.save();

    const verificationLink = `${ENV_VARS.ACTIVE_LINK}/api/v1/auth/verify-email?token=${token}`;
    await sendVerificationEmail(email, verificationLink);

    res.status(201).json({
      success: true,
      message: "Signup successful! Please verify your email.",
    });
  } catch (error) {
    console.log("Error in signup controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// Email verification function
export async function verifyEmail(req, res) {
  try {
    const { token } = req.query;
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token." });
    }

    if (user.verificationTokenExpires < Date.now()) {
      // Clear expired token data

      user.verificationToken = null;
      user.verificationTokenExpires = null;
      await user.save();
      return res
        .status(400)
        .json({ success: false, message: "Verification token has expired." });
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    generateTokenAndSetCookie(user._id, res);
    return res.redirect(`${ENV_VARS.CLIENT_URL}`);
  } catch (error) {
    console.log("Error in verifyEmail controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function authCheck(req, res) {
  try {
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

    const user = await User.findOne({ email });
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
