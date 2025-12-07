
const socket = io();

let selectedSlot = null;
let selectedSlotId = null;
let selectedType = '';

document.addEventListener('DOMContentLoaded', () => {
  fetchSlots();

  socket.on('slotUpdated', () => {
    fetchSlots();
  });
});

function fetchSlots() {
  fetch('/api/slots')
    .then(res => res.json())
    .then(slots => renderSlots(slots));
}

function renderSlots(slots) {
  const container = document.getElementById('slots');
  if (!container) return;
  container.innerHTML = '';

  slots.forEach(slot => {
    const div = document.createElement('div');
    div.className = 'slot ' + slot.status;
    div.textContent = 'Slot ' + slot.number;
    div.title = `Slot ${slot.number} - ${slot.status.toUpperCase()} - ₹40/hr`;

    div.onclick = () => {
      if (slot.status === 'available' || slot.status === 'reserved') {
        selectedSlot = slot.number;
        selectedSlotId = slot._id;
        selectedType = slot.status;
        openConfirmation();
      }
    };

    container.appendChild(div);
  });
}

// 🔹 Show "Are you sure?" modal
function openConfirmation() {
  document.getElementById('confirmTitle').innerText = `Book Slot #${selectedSlot}`;
  document.getElementById('confirmDescription').innerText = `Are you sure you want to book Slot #${selectedSlot}? Charges: ₹40/hr`;
  document.getElementById('confirmationModal').style.display = 'block';
}

function closeConfirmation() {
  document.getElementById('confirmationModal').style.display = 'none';
}

// 🔸 On Confirm button, show full form
function proceedToBooking() {
  closeConfirmation();
  openModal();
}

function openModal() {
  const title = selectedType === 'available' ? `Book Slot #${selectedSlot}` : `Reserved Slot #${selectedSlot}`;
  const description = selectedType === 'available'
    ? `Are you sure you want to book Slot #${selectedSlot}? Charges: ₹40/hr`
    : `Slot #${selectedSlot} is reserved. Special rules may apply.`;

  document.getElementById('modalTitle').innerText = title;
  document.getElementById('modalDescription').innerText = description;
  document.getElementById('bookingModal').style.display = 'block';




  // ✅ Auto-fill hidden input with selected slot ID
  const slotInput = document.getElementById('slotId');
  if (slotInput) {
    slotInput.value = selectedSlotId;
    console.log("✅ Slot ID set in hidden input:", selectedSlotId);
  }
}

function closeModal() {
  document.getElementById('bookingModal').style.display = 'none';
  selectedSlot = null;
  selectedSlotId = null;
  selectedType = '';
}

function submitBooking(e) {
  e.preventDefault();
  const form = document.getElementById('bookingForm');
  const formData = new FormData(form);

  const payload = {
    slotId: selectedSlotId,
    name: formData.get('name'),
    vehicle: formData.get('vehicle'),
    date: formData.get('date'),
    fromTime: formData.get('fromTime'),
    toTime: formData.get('toTime'),
    notes: formData.get('notes'),
    type: selectedType,
  };

  fetch('/api/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      socket.emit('bookSlot', { slotId: selectedSlotId });
      closeModal();
      window.location.reload();
    })
    .catch(err => {
      alert('Something went wrong!');
      console.error(err);
    });
}
















// const socket = io();

// let selectedSlot = null;
// let selectedSlotId = null;
// let selectedType = '';

// document.addEventListener('DOMContentLoaded', () => {
//   fetchSlots();
//   fetchLocations(); // ✅ add this line to fetch locations

//   socket.on('slotUpdated', () => {
//     fetchSlots();
//   });
// });

// // 🔹 Fetch available locations and populate dropdown
// function fetchLocations() {
//   const select = document.getElementById('locationSelect');
//   if (!select) return;

//   fetch('/api/locations') // ✅ tumhara endpoint jo locations return kare
//     .then(res => res.json())
//     .then(locations => {
//       locations.forEach(loc => {
//         const option = document.createElement('option');
//         option.value = loc._id; // ya loc.id jo bhi tumhare DB me hai
//         option.textContent = `${loc.name}, ${loc.city}`;
//         select.appendChild(option);
//       });
//     })
//     .catch(err => console.error('Error fetching locations:', err));
// }

// function fetchSlots() {
//   fetch('/api/slots')
//     .then(res => res.json())
//     .then(slots => renderSlots(slots));
// }

// function renderSlots(slots) {
//   const container = document.getElementById('slots');
//   if (!container) return;
//   container.innerHTML = '';

//   slots.forEach(slot => {
//     const div = document.createElement('div');
//     div.className = 'slot ' + slot.status;
//     div.textContent = 'Slot ' + slot.number;
//     div.title = `Slot ${slot.number} - ${slot.status.toUpperCase()} - ₹40/hr`;

//     div.onclick = () => {
//       if (slot.status === 'available' || slot.status === 'reserved') {
//         selectedSlot = slot.number;
//         selectedSlotId = slot._id;
//         selectedType = slot.status;
//         openConfirmation();
//       }
//     };

//     container.appendChild(div);
//   });
// }

// // 🔹 Show "Are you sure?" modal
// function openConfirmation() {
//   document.getElementById('confirmTitle').innerText = `Book Slot #${selectedSlot}`;
//   document.getElementById('confirmDescription').innerText = `Are you sure you want to book Slot #${selectedSlot}? Charges: ₹40/hr`;
//   document.getElementById('confirmationModal').style.display = 'block';
// }

// function closeConfirmation() {
//   document.getElementById('confirmationModal').style.display = 'none';
// }

// // 🔸 On Confirm button, show full form
// function proceedToBooking() {
//   closeConfirmation();
//   openModal();
// }

// function openModal() {
//   const title = selectedType === 'available' ? `Book Slot #${selectedSlot}` : `Reserved Slot #${selectedSlot}`;
//   const description = selectedType === 'available'
//     ? `Are you sure you want to book Slot #${selectedSlot}? Charges: ₹40/hr`
//     : `Slot #${selectedSlot} is reserved. Special rules may apply.`;

//   document.getElementById('modalTitle').innerText = title;
//   document.getElementById('modalDescription').innerText = description;
//   document.getElementById('bookingModal').style.display = 'block';
// }

// function closeModal() {
//   document.getElementById('bookingModal').style.display = 'none';
//   selectedSlot = null;
//   selectedSlotId = null;
//   selectedType = '';
// }

// function submitBooking(e) {
//   e.preventDefault();
//   const form = document.getElementById('bookingForm');
//   const formData = new FormData(form);

//   const payload = {
//     slotId: selectedSlotId,
//     name: formData.get('name'),
//     vehicle: formData.get('vehicle'),
//     date: formData.get('date'),
//     fromTime: formData.get('fromTime'),
//     toTime: formData.get('toTime'),
//     notes: formData.get('notes'),
//     locationId: formData.get('locationId'), // ✅ added location
//     type: selectedType,
//   };

//   fetch('/api/book', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(payload)
//   })
//     .then(res => res.json())
//     .then(data => {
//       alert(data.message);
//       socket.emit('bookSlot', { slotId: selectedSlotId });
//       closeModal();
//       window.location.reload();
//     })
//     .catch(err => {
//       alert('Something went wrong!');
//       console.error(err);
//     });
// }





