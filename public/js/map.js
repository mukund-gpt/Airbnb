maptilersdk.config.apiKey = mapToken;
const map = new maptilersdk.Map({
  container: "map", // container's id or the HTML element to render the map
  style: maptilersdk.MapStyle.STREETS,
  center: coordinates, // starting position [lng, lat]
  zoom: 14, // starting zoom
});

// Create a popup
const popup = new maptilersdk.Popup({ offset: 25 }).setText(
  "Your location on booking"
);

// Add a marker with popup
const marker = new maptilersdk.Marker({
  color: "red",
})
  .setLngLat(coordinates)
  .setPopup(popup) // Associate the popup with the marker
  .addTo(map);

marker.getElement().addEventListener("mouseleave", () => {
  popup.addTo(map);
  marker.togglePopup();
});

marker.getElement().addEventListener("mouseenter", () => {
  marker.togglePopup();
});
