const express = require('express');
const router = express.Router();
const Slot = require('../models/Slot');
const Booking = require('../models/Booking');
const authMiddleware = require('../middleware/auth');

router.get('/slots', async (req, res) => {
  try {
    const slots = await Slot.find();
    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 🟢 Only logged-in users can book
// 🟢 Only logged-in users can book
router.post('/book', authMiddleware, async (req, res) => {
  try {
    const { slotId, name, vehicle, date, fromTime, toTime, notes } = req.body;

    const slot = await Slot.findById(slotId);
    if (!slot || slot.status === 'booked') {
      return res.status(400).json({ error: 'Slot already booked or not found' });
    }

    slot.status = 'booked';
    await slot.save();

    const booking = new Booking({
      userId: req.user._id,
      slotId: slot._id,
      name,
      vehicle,
      date,
      fromTime,
      toTime,
      notes
    });

    await booking.save();

    res.json({ message: 'Slot booked successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error booking slot' });
  }
});


module.exports = router;