// scripts/initSlots.js

const mongoose = require('mongoose');
const Slot = require('../models/Slot');

mongoose.connect('mongodb://localhost:27017/parkease', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function initSlots() {
  await Slot.deleteMany({}); // optional: reset all
  for (let i = 1; i <= 30; i++) {
    await Slot.create({
      number: i,
      status: 'available',
      type: 'standard'
    });
  }
  console.log('✅ 30 Slots created');
  mongoose.disconnect();
}

initSlots();



