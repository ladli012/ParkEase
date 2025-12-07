 
// ✅ JS Loaded check
console.log("✅ dashboard.js loaded successfully");

// 🔹 Event delegation for Pay button (modal ke andar bhi chalega)
document.addEventListener('click', async (e) => {
  if (e.target && e.target.id === 'payBtn') {
    console.log("✅ Pay button clicked!");

    const fromInput = document.querySelector('input[name="fromTime"]');
    const toInput = document.querySelector('input[name="toTime"]');
    const slotIdInput = document.getElementById('slotId');
    const nameInput = document.querySelector('input[name="name"]');
    const vehicleInput = document.querySelector('input[name="vehicle"]');
    const phoneInput = document.querySelector('input[name="phone"]');
    const notesInput = document.querySelector('textarea[name="notes"]');
    const dateInput = document.querySelector('input[name="date"]');

    if (!fromInput || !toInput || !slotIdInput) {
      alert("⚠️ Please fill all required fields first!");
      return;
    }

    const fromTime = fromInput.value;
    const toTime = toInput.value;
    const slotId = slotIdInput.value;
    const name = nameInput.value;
    const vehicle = vehicleInput.value;
    const phone = phoneInput ? phoneInput.value : "";
    const notes = notesInput.value;
    const date = dateInput.value;

    if (!fromTime || !toTime || !slotId) {
      alert("Please fill all details before payment.");
      return;
    }

    const [fromHour, fromMin] = fromTime.split(':').map(Number);
    const [toHour, toMin] = toTime.split(':').map(Number);
    let duration = (toHour + toMin / 60) - (fromHour + fromMin / 60);

    if (duration <= 0) {
      alert("Invalid time selection!");
      return;
    }

    const amount = Math.round(duration * 40);

    try {
      // 🔹 Create Razorpay order
      const response = await fetch('/payment/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });

      const data = await response.json();
      if (!data.success) {
        alert('Payment initialization failed');
        return;
      }

      // 🔹 Razorpay Options
      const options = {
        key: "rzp_test_RRKWTGDNIAgRtL",
        amount: data.order.amount,
        currency: "INR",
        name: "ParkEase",
        description: `Parking for ${duration} hour(s)`,
        order_id: data.order.id,

        handler: async function (response) {
          alert(`✅ Payment Successful! ₹${amount} paid.`);

          // 🔹 Save booking after payment
          const bookingResponse = await fetch('/api/book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              slotId,
              name,
              vehicle,
              phone,
              date,
              fromTime,
              toTime,
              notes
            })
          });

          const bookingData = await bookingResponse.json();
          if (bookingResponse.ok) {
            alert('✅ Slot booked successfully!');
            const bookedSlot = document.querySelector(`[data-slot-id="${slotId}"]`);
            if (bookedSlot) bookedSlot.classList.add('booked');
          } else {
            alert('Booking failed: ' + bookingData.error);
          }
        },
        theme: { color: "#3399cc" }
      };

      const rzp = new Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment Error:', error);
      alert('Something went wrong. Please try again.');
    }
  }
});

// 🔹 Function to update "Pay ₹" button text when time changes
document.addEventListener('DOMContentLoaded', () => {
  const fromInput = document.querySelector('input[name="fromTime"]');
  const toInput = document.querySelector('input[name="toTime"]');
  const paymentBtn = document.getElementById('payBtn');

  function updatePaymentAmount() {
    if (!fromInput || !toInput || !paymentBtn) return;

    const fromTime = fromInput.value;
    const toTime = toInput.value;

    if (!fromTime || !toTime) {
      paymentBtn.innerText = `Pay ₹0`;
      return;
    }

    const [fromHour, fromMin] = fromTime.split(':').map(Number);
    const [toHour, toMin] = toTime.split(':').map(Number);
    let duration = (toHour + toMin / 60) - (fromHour + fromMin / 60);

    if (duration <= 0) {
      paymentBtn.innerText = `Pay ₹0`;
      return;
    }

    const amount = Math.round(duration * 40);
    paymentBtn.innerText = `Pay ₹${amount}`;
  }

  if (fromInput && toInput) {
    fromInput.addEventListener('change', updatePaymentAmount);
    toInput.addEventListener('change', updatePaymentAmount);
  }

  updatePaymentAmount();
});
