import User from '../models/User'
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { Router } from 'express';
const router = Router();


// <----------- signup ----------->
router.post("/signup", async (req, res) => {
  try {
    const { username, password, email, level } = req.body;

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      email,
      level,
    });

    await user.save();

    res.status(201).json({
      status: "success",
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to create user" });
  }
});

// <----------- login ----------->

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Authentication failed' });
    }

    // Compare the password with the hash stored in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({status: 'success', message: 'Authentication failed' });
    }

    // Create a JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ status:'success', token });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to login' });
  }
});

export default router