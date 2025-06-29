let map = L.map('map').setView([20.5937, 78.9629], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let markersLayer = L.layerGroup().addTo(map);
let markerMap = new Map();

async function geocodeAddress(address) {
  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
  const data = await res.json();
  if (data.length === 0) return null;
  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon)
  };
}

async function plotStationsOnMap(stations) {
  markersLayer.clearLayers();
  markerMap.clear();
  const bounds = [];

  for (const station of stations) {
    const loc = await geocodeAddress(station.address);
    if (!loc) continue;

    const marker = L.marker([loc.lat, loc.lon])
      .bindPopup(`<strong>${station.name}</strong><br>${station.address}`)
      .addTo(markersLayer);

    markerMap.set(station.id, marker);
    bounds.push([loc.lat, loc.lon]);
  }

  if (bounds.length > 0) map.fitBounds(bounds);
}

function focusMarker(stationId) {
  const marker = markerMap.get(stationId);
  if (marker) {
    map.setView(marker.getLatLng(), 15);
    marker.openPopup();
  }
}
