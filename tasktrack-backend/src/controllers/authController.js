const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  validateEmail,
  validateName,
  validatePassword,
} = require("../utils/validators");

// Register Controller (POST /api/auth/register)
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check name
    const nameValidation = validateName(name);
    if (!nameValidation.isValid) {
      return res.status(400).json({
        error: nameValidation.error,
      });
    }

    // Check email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({
        error: emailValidation.error,
      });
    }

    // Check password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        error: passwordValidation.error,
      });
    }

    // Checking if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        error: "Email already exists. Please login instead.",
      });
    }

    // Create New User
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password,
    });

    // When .save() is called, Mongoose runs pre('save') middleware
    // pre('save') hashes the password before storing
    await newUser.save();

    //Generate JWT Token
    const token = jwt.sign(
      {
        userId: newUser._id, // ↑ MongoDB ID of user
        email: newUser.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE || "7d", // ↑ Token expires in 7 days
      }
    );

    // Send Success Response
    return res.status(201).json({
      message: "User Registered Successfully",
      //Send token so frontend can start making authenticated requests
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.log("Register Error: ", error);

    return res.status(500).json({
      error: "Error during registration, Please try again.",
    });
  }
};

// Login Controller (POST /api/auth/login)

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({
        error: emailValidation.error,
      });
    }

    // Check password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        error: passwordValidation.error,
      });
    }

    // Find User by Email
    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");
    if (!user) {
      return res.status(401).json({
        error: "Email or password is incorrect",
      });
    }

    // Compare Passwords
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        error: "Email or password is incorrect",
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE || "7d",
      }
    );

    // Send Success Response
    return res.status(200).json({
      message: "Login Successful",
      token,
      //Send token so frontend can start making authenticated requests
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("Login error: ", error);
    return res.status(500).json({
      error: "Error during login. Please try again.",
    });
  }
};

// Get Current User Controller
// GET /api/auth/me (protected route)
const getCurrentUser = async (req, res) => {
  // ↑ This route is protected, so req.user already set by middleware
  try {
    // authMiddleware already verified token and set req.user
    const userId = req.user.userId;

    // Find User in Database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Send User Data
    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      error: "Error fetching user data",
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
};
