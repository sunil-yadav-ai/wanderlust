


const coords = window.placesData;

const lat = coords.lat;
const lon = coords.lon;

// map create
const map = L.map('map').setView([lat, lon], 20);

// tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 9
}).addTo(map);

// marker
L.marker([lat, lon]).addTo(map)
  .bindPopup("welcome to WanderLust")
  .openPopup();


