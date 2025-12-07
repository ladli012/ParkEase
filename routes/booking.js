const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Slot = require('../models/Slot');

// 🔹 Create Booking
router.post('/api/book', async (req, res) => {
  try {
    const { slotId, name, vehicle, date, fromTime, toTime, notes, type } = req.body;

    if (!slotId || !name || !vehicle || !date || !fromTime || !toTime) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const booking = new Booking({
      slotId,
      name,
      vehicle,
      date,
      fromTime,
      toTime,
      notes,
      type
    });

    await booking.save();
    await Slot.findByIdAndUpdate(slotId, { status: 'booked' });

    res.json({ message: '✅ Booking successful!' });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ message: 'Error saving booking' });
  }
});

module.exports = router;
