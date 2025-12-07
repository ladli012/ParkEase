// server.js
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cookieParser = require('cookie-parser');
const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// 🟢 Models
const User = require('./models/User');

// 🟢 Routes
const paymentRoutes = require('./routes/payment');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');

// 🟢 Middleware
const authMiddleware = require('./middleware/auth');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const JWT_SECRET = 'your_secret_key'; // same as auth.js

// 🔗 MongoDB connection
mongoose.connect('mongodb://localhost:27017/parkease', {
  useNewUrlParser: true,
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// 🌐 Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 🛣️ Routes
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/payment', authMiddleware, paymentRoutes);

// 🔒 Already logged-in check middleware
const alreadyLoggedIn = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (user) return res.redirect('/'); // logged in → home
    next();
  } catch (err) {
    next();
  }
};

// 🏠 Views (Protected)
app.get('/', authMiddleware, (req, res) => {
  res.render('home', { user: req.user });
});

app.get('/dashboard', authMiddleware, (req, res) => {
  res.render('dashboard', { user: req.user });
});

// 🔓 Public routes with auto-redirect if already logged in
app.get('/login', alreadyLoggedIn, (req, res) => res.render('login'));
app.get('/register', alreadyLoggedIn, (req, res) => res.render('register'));
app.get('/about', (req, res) => res.render('about'));
app.get('/contact', (req, res) => res.render('contact'));
app.get('/faqs', (req, res) => res.render('faqs'));

// 🚪 Logout route
app.get('/logout', (req, res) => {
  res.clearCookie('token');  // JWT token delete
  res.redirect('/login');    // back to login page
});

// 📄 Profile (Protected)
app.get('/profile', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.render('profile', { user });
});

// 📩 Contact form
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  console.log('📨 Contact form submission:', { name, email, message });
  res.send('Thank you for contacting us! We will get back to you soon.');
});

// 📍 Location Save API (Protected)
app.post('/api/location', authMiddleware, async (req, res) => {
  const { latitude, longitude } = req.body;
  const userId = req.user._id;

  try {
    const geoRes = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        latlng: `${latitude},${longitude}`,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    const results = geoRes.data.results;
    const address = results.length > 0 ? results[0].formatted_address : 'Address not found';

    await User.findByIdAndUpdate(userId, {
      location: { latitude, longitude, address }
    });

    res.json({ message: 'Location saved', address });
  } catch (error) {
    console.error('❌ Error in reverse geocoding:', error);
    res.status(500).json({ message: 'Failed to save location' });
  }
});

// 📡 Socket.IO
io.on('connection', (socket) => {
  console.log('User connected');
  socket.on('bookSlot', (data) => io.emit('slotUpdated', data));
  socket.on('disconnect', () => console.log('User disconnected'));
});

// 404 Page Not Found
app.use((req, res) => res.status(404).render('404'));

// 🚀 Start server
server.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));

