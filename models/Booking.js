const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot' },





  name: String,
  vehicle: String,
  

  date: String,
  fromTime: String,
  toTime: String,
  notes: String,
  bookedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);


