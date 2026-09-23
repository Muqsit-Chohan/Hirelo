import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verificationMailer } from "../utils/sendEmail.js";
import crypto from "crypto";
import { Storage } from "../utils/supabaseStorage.js";
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role, location, about, companyName } =
      req.body;
    // if (
    //   !fullName ||
    //   !email ||
    //   !password ||
    //   !role ||
    //   !phoneNumber ||
    //   !location
    // ) {
    //   return res.status(400).json({
    //     message: "All required fields missing",
    //     success: false,
    //   });
    // }
    const user = await User.findByEmail(email);
    if (user) {
      return res.status(409).json({
        message: user.isVerified ? "Email already registered. Please log in." : "Account already exists. Please resend the verification email.",
        verificationRequired: !user.isVerified,
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    await User.create({
      fullName,
      companyName: companyName || "",
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role,
      phoneNumber,
      location,
      about,
      isVerified: false,
      verificationToken,
      verificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });
    try {
      await verificationMailer.send(email, verificationToken);
    } catch (error) {
      console.error("Verification email delivery failed:", error.code || "EMAIL_DELIVERY_FAILED");
      return res.status(503).json({
        success: false,
        accountCreated: true,
        verificationRequired: true,
        message: "Account created, but verification email could not be sent. Please try resending it later.",
      });
    }
    return res.status(201).json({
      message:
        "Account created! Please check your email to verify your account.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(error.code === "23505" ? 409 : 500).json({
      message: error.code === "23505" ? "Email already registered" : "Registration failed",
      success: false,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "All required fields missing",
        success: false,
      });
    }
    let user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({
        message: "incorrect email or password",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "incorrect email or password",
        success: false,
      });
    }
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first!",
        success: false,
      });
    }
    // const tokenData = {
    //   userId: user._id,
    // };
    if (!process.env.SECRET_KEY) {
      throw new Error("Secret key not configured");
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.SECRET_KEY,
      {
        expiresIn: "1d",
      },
    );
    user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      profile: user.profile,
    };
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .json({
        message: `welcome back ${user.fullName}`,
        success: true,
        user: await Storage.userResponse(user),
        token
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const logOut = (req, res) => {
  try {
    return res
      .status(200)
      .clearCookie("token", { httpOnly: true, sameSite: "none",  secure: true, })
      .json({
        message: "logout successfully",
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (typeof token !== "string" || !token) {
      return res.status(400).json({ message: "Verification token is required", success: false });
    }
    const user = await User.findByVerificationToken(token);

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification link.",
        success: false,
      });
    }

    const verified = await User.verify(user._id, token);
    if (!verified) {
      return res.status(400).json({ message: "Invalid or expired verification link.", success: false });
    }

    // ✅ React frontend pe redirect
    return res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({ message: "Email is required", success: false });
    }
    const user = await User.findByEmail(email);

    if (!user) return res.status(404).json({ message: "User not found", success: false });
    if (user.isVerified) return res.status(400).json({ message: "Email already verified", success: false });

    const verificationToken = crypto.randomBytes(32).toString("hex");
    await User.update(user._id, {
      verificationToken,
      verificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });

    try {
      await verificationMailer.send(email, verificationToken);
    } catch (error) {
      console.error("Verification email delivery failed:", error.code || "EMAIL_DELIVERY_FAILED");
      return res.status(503).json({ success: false, message: "Verification email could not be sent. Please try again later." });
    }

    return res.status(200).json({ message: "Verification email resent!", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(401).json({ success: false, message: "User not found" });
    return res.status(200).json({ data: await Storage.userResponse(user) });
  } catch {
    return res.status(500).json({ success: false, message: "Unable to load user" });
  }
};
