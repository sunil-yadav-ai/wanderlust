 // map create
  var map = L.map('map').setView([28.6139, 77.2090], 10);

  // map layer (OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // marker
  L.marker([28.6139, 77.2090]).addTo(map)
    .bindPopup("Mera Location")
    .openPopup();