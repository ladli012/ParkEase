const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  location: {
    latitude: Number,
    longitude: Number,
    address: String
  }
});  




module.exports = mongoose.model('User', userSchema);
