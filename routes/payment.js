//routes/Payment.js
const express = require('express');
const Razorpay = require('razorpay');
require('dotenv').config();
const router = express.Router();
const Slot = require('../models/Slot');

// ✅ Initialize Razorpay instance
const razorpay = new Razorpay({
  //key_id: process.env.RAZORPAY_LIVE_ID_KEY,   ---->for live 
  //key_secret: process.env.RAZORPAY_LIVE_SECRET_KEY  --for live 


  key_id: process.env.RAZORPAY_ID_KEY,   
  key_secret: process.env.RAZORPAY_SECRET_KEY
});

// ✅ Create Order API
router.post('/order', async (req, res) => {
  try { 

    const options = {
      amount: req.body.amount * 100, // amount in paise (₹40 => 4000)
      currency: 'INR',
      receipt: `order_rcptid_${Math.random().toString(36).substring(2, 8)}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Payment order creation failed' });
  }
});


// ✅ After successful payment → update slot
router.post('/update-slot', async (req, res) => {
  try {
    const { slotNumber, startTime, endTime, userId } = req.body;

    // 🔹 Update slot in MongoDB
    const updatedSlot = await Slot.findOneAndUpdate(
      { number: slotNumber },
      {
        status: 'booked',
        bookedBy: userId || null,
        startTime: new Date(startTime),
        endTime: new Date(endTime)
      },
      { new: true }
    );

    if (!updatedSlot) {
      return res.status(404).json({ success: false, message: 'Slot not found' });
    }

    res.json({ success: true, slot: updatedSlot });
  } catch (err) {
    console.error('Slot update failed:', err);
    res.status(500).json({ success: false, message: 'Failed to update slot' });
  }
});

module.exports = router;

































