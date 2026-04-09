

  document.addEventListener("DOMContentLoaded", () => {
  const coords = window.placesData; 

  if (!coords) {
    console.error("No coordinates found");
    return;
  }

  const lat = coords.lat;
  const lon = coords.lon;

  const map = L.map('map').setView([lat, lon], 15);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
  }).addTo(map);

  L.marker([lat, lon]).addTo(map)
    .bindPopup("welcome to WanderLust")
    .openPopup();
});
