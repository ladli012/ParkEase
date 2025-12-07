const express = require('express');
const mongoose = require('mongoose');  // ✅ Add this line

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

  //router.post('/api/book', async (req, res) => {

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






// ---------------------------------------------------
// ✅ LOCATION SCHEMA (NEW)
// ---------------------------------------------------
const LocationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true }
});

const Location = mongoose.model('Location', LocationSchema);

// ---------------------------------------------------
// ✅ ADD LOCATION API
// ---------------------------------------------------
router.post('/add-location', async (req, res) => {
  try {
    const { name, city } = req.body;

    if (!name || !city) {
      return res.status(400).json({ message: 'Name and city are required' });
    }

    const newLocation = new Location({ name, city });
    await newLocation.save();

    res.status(201).json({ message: 'Location added successfully', location: newLocation });
  } catch (err) {
    res.status(500).json({ message: 'Error adding location', error: err });
  }
});

// ---------------------------------------------------
// ✅ GET ALL LOCATIONS API
// ---------------------------------------------------
router.get('/locations', async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching locations', error: err });
  }
});

module.exports = router;




