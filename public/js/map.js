document.addEventListener("DOMContentLoaded", () => {
  const mapContainer = document.getElementById("map");

  if (!mapContainer || typeof listingCoordinates === "undefined") return;

  const map = L.map("map").setView(listingCoordinates, 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  L.marker(listingCoordinates)
    .addTo(map)
    .bindPopup(`${listingTitle} - ${listingLocation}`)
    .openPopup();
});

// const marker = new mapboxgl.Marker()
// .setLngLat([12.554729, 55.70651])
// .addTo(map);


// document.addEventListener("DOMContentLoaded", () => {
//   const mapContainer = document.getElementById("map");

//   if (!mapContainer || typeof listingCoordinates === "undefined") return;

//   const map = L.map("map").setView(listingCoordinates, 13);

//   L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     attribution: "© OpenStreetMap contributors",
//   }).addTo(map);

//   L.marker(listingCoordinates)
//     .addTo(map)
//     .bindPopup(`<b>${listingTitle}</b><br>${listingLocation}`)
//     .openPopup();
// });


