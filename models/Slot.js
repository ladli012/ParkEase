// models/Slot.js
const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  number: Number,
  status: {
    type: String,
    enum: ['available', 'booked', 'reserved'],
    default: 'available'
  },
  type: {
    type: String,
    default: 'standard'
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  startTime: Date,
  endTime: Date
});

module.exports = mongoose.model('Slot', slotSchema);





