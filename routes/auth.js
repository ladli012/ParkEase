// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 🔐 Register Route
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: 'Email already registered' });
    }

    const user = new User({ name, email, password }); // Note: In production, hash password
    await user.save();
    res.json({ success: true, message: 'Registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 🔓 Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password }); // Note: In production, use hashed passwords
    if (!user) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }

    req.session.user = user;
    res.json({ success: true, message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 🚪 Logout Route
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
