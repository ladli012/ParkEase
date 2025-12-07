

// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

const JWT_SECRET = 'your_secret_key'; // ✅ same key as in middleware/auth.js

// 🔐 REGISTER Route
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: 'Email already registered' });
    }

    const newUser = new User({ name, email, password }); // (hash later if needed)
    await newUser.save();

    // 🔸 Create JWT token
    const token = jwt.sign({ _id: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

    // 🔸 Store in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // set true if using https
      sameSite: 'lax',
    });

    res.json({ success: true, message: 'Registered successfully', token });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 🔓 LOGIN Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }

    // 🔸 Create JWT token
    const token = jwt.sign({ _id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    // 🔸 Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });
    console.log("Cookie sent:", token);
    res.json({ success: true, message: 'Login successful', token });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 🚪 LOGOUT Route
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;
 