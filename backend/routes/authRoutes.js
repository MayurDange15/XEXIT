const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const dotenv = require("dotenv");

dotenv.config();

const { SECRET_KEY, HR_EMAIL, HR_PASSWORD } = process.env;

// User Registration
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the role of "employee"
    const newUser = new User({
      username,
      password: hashedPassword,
      role: "employee",
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
});

// Login Endpoint
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    // Check if credentials match HR
    if (username === HR_EMAIL && password === HR_PASSWORD) {
      const token = jwt.sign({ id: "HR", role: "hr" }, SECRET_KEY, {
        expiresIn: "1d",
      });
      return res.status(200).json({ token });
    }

    // Check if the user exists in the database (Employee)
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token for employee
    const token = jwt.sign({ id: user._id, role: "employee" }, SECRET_KEY, {
      expiresIn: "1d",
    });
    res.status(200).json({ token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error during login", error: error.message });
  }
});

module.exports = router;
