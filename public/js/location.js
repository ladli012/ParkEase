function saveUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      fetch('/api/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude: lat, longitude: lon })
      })
      .then(res => res.json())
      .then(data => {
        document.getElementById('locationDisplay').innerText = `📍 ${data.address}`;
        alert('Location saved: ' + data.address);
      })
      .catch(() => alert('Error saving location'));
    }, () => {
      alert('Permission denied or error getting location');
    });
  } else {
    alert('Geolocation not supported');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('getLocationBtn').addEventListener('click', saveUserLocation);
});
