// server.js
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const socketIo = require('socket.io');

const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// 🔗 MongoDB connection
mongoose.connect('mongodb://localhost:27017/parkease', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// 🛠️ Session setup
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/parkease' }),
  })
);

// 🌐 Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 🛣️ Routes
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);

// 🔐 Auth Middleware
function isAuthenticated(req, res, next) {
  if (req.session.user) next();
  else res.redirect('/login');
}

// 📄 Views

// app.get('/', (req, res) => {
//   res.render('dashboard');  // 🔄 instead of index
// }); 


// app.get('/', isAuthenticated, (req, res) => {
//   res.render('index', { user: req.session.user });
// });

app.get('/', (req, res) => {
  res.render('index');
});


app.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard', { user: req.session.user });
});


app.get('/login', (req, res) => res.render('login'));
app.get('/register', (req, res) => res.render('register'));

// 🔁 Logout View Redirection Support (Optional if needed)
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// 📡 Socket.IO
io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('bookSlot', (data) => {
    io.emit('slotUpdated', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// 🚀 Start server
server.listen(3000, () => console.log('Server running on http://localhost:3000'));
