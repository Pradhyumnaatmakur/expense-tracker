import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { username, fullName, email, password } = req.body;

    if (!username || !fullName || !email || !password) {
      return res.status(400).json({ message: "Enter All Fields" });
    }

    const trimmedUsername = username.trim().toLowerCase();

    const existingUsername = await User.findOne({ username: trimmedUsername });

    if (existingUsername) {
      return res
        .status(400)
        .json({ message: "Username Is Already Taken, Try Other" });
    }

    const validEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!validEmail.test(email)) {
      return res.status(400).json({ message: "Enter A Valid Email" });
    }

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({ message: "Email Already In Use" });
    }

    const validPassword =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/;

    if (!validPassword.test(password)) {
      return res.status(400).json({
        message:
          "Password Must Be At least 8 Characters, Contain One Uppercase, Lowercase, One Digit, One Special Symbol ",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username: trimmedUsername,
      password: hashedPassword,
      email,
      fullName,
    });

    await newUser.save();
    generateToken(newUser._id, res);

    res.status(201).json({
      message: "Sign Up successful",
      user: {
        username,
        fullName,
        email,
      },
    });
  } catch (error) {
    console.error("ERROR IN signup CONTROLLER", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Enter Username and password" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      message: "Logged In",
      user: {
        username: user.username,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error("ERROR IN login CONTROLLER", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ message: "Logged Out" });
  } catch (error) {
    console.error("ERROR IN logout CONTROLLER", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json(null);
    }

    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("ERROR IN getMe CONTROLLER", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
