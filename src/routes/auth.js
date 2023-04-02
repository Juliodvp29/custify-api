import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';


import { Router } from "express";
const router = Router();

// <----------- signup ----------->
router.post("/signup", async (req, res) => {
  try {
    const { username, password, email, level } = req.body;

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(409).json({ status: "error", message: "Username already exists", data: [] });
      }
      if (existingUser.email === email) {
        return res.status(409).json({status: "error", message: "Email already exists", data: [] });
      }
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      email,
      level,
    });

    await user.save();

    const payload = { userId: user._id };
    const secretKey = "secret"; //usar una clave secreta más segura en producción
    const options = { expiresIn: "1d" }; // Opcional, especifica la duración del token
    const token = jwt.sign(payload, secretKey, options);

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      token,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to create user", data: [] });
  }
});

// <----------- login -----------> 

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: "Authentication failed", data: [] });
    }

    // Compare the password with the hash stored in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ status: "error", message: "Authentication failed", data: [] });
    }

    // Create a JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.status(200).json({ status: "success", token, data: user });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to login", data: [] });
  }
});

export default router;
