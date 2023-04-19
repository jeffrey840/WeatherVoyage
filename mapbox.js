// Import the Mapbox API key from the keys.js file
import { MAPBOX_API_KEY} from './keys.js';

// Import the appendImageToCard function from the pexelsAPI.js file
import { appendImageToCard } from './pexelsAPI.js';

// Import the createRadarLayer and addRadarControls functions from the radar.js file
import { createRadarLayer, addRadarControls } from './radar.js';

// Set the Mapbox access token to the imported API key
const MAPBOX_ACCESS_TOKEN = MAPBOX_API_KEY;

// Declare the map variable
let map;

// Set the Mapbox access token
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

// Define a function that retrieves the coordinates for a search query
export function geocode(searchInput) {
	// Construct the URL for the Mapbox Geocoding API
	const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchInput)}.json?access_token=${MAPBOX_ACCESS_TOKEN}`;
	// Fetch the data from the API
	return fetch(url)
		.then(response => response.json())
		.then(data => {
			if (data.features.length > 0) {
				// If the data contains a feature, fly to its coordinates and return the coordinates
				const coordinates = data.features[0].geometry.coordinates;
				map.flyTo({
					center: coordinates,
					zoom: 14,
					essential: true
				});

				// Construct the URL for the National Weather Service API to retrieve any alerts or warnings for the location
				const nwsUrl = `https://api.weather.gov/alerts/active?point=${coordinates[1]},${coordinates[0]}`;
				// Fetch the data from the API
				return fetch(nwsUrl)
					.then(response => response.json())
					.then(alertData => {
						if (alertData.features.length > 0) {
							// If the data contains alerts or warnings, log the type of the first alert or warning
							const alertType = alertData.features[0].properties.event;
							console.log(`There is a ${alertType} warning/alert for this location.`);
						} else {
							// If there are no alerts or warnings, log a message to the console
							console.log("There are no weather alerts or severe weather warnings for this location.");
						}

						return coordinates; // Return the coordinates
					})
					.catch(error => {
						console.error("Error fetching weather alert data:", error);
					});
			} else {
				// If the data does not contain a feature, alert the user and return null
				alert('Location not found. Please try another search.');
				return null;
			}
		})
		.catch(error => {
			console.error("Error fetching geocoding data:", error);
		});
}


// Define a function that initializes the map
function initMap(centerCoordinates, styleId) {
	// Set the style URL based on the provided style ID
	let styleUrl = `mapbox://styles/mapbox/${styleId}`;
	if (styleId === 'adoucett/cjf5k84bp0p7t2rmiwvwikhyn') {
		styleUrl = `mapbox://styles/${styleId}`;
	}
	// Create a new Mapbox map with the provided center coordinates and style
	map = new mapboxgl.Map({
		container: 'map',
		style: styleUrl,
		center: centerCoordinates,
		zoom: 9
	});
}

// Define an array of Mapbox styles and a variable to track the current style index
// const toggleMapButton = document.getElementById('toggle-map-button');
let currentStyleIndex = 0;
const styles = [
	'streets-v11',
	'navigation-night-v1',
	'outdoors-v11',
	'satellite-streets-v12',
	// 'styles/x-ray.JSON',
	'adoucett/cjf5k84bp0p7t2rmiwvwikhyn',
	// 'style/',
	// 'style/',
];

const styleForwardButton = document.getElementById('style-forward');
const styleBackwardButton = document.getElementById('style-backward');

styleForwardButton.addEventListener("click", () => {
	// Update the current style index and retrieve the style ID for the new style
	currentStyleIndex = (currentStyleIndex + 1) % styles.length;
	updateMapStyle();
});

styleBackwardButton.addEventListener("click", () => {
	// Update the current style index and retrieve the style ID for the new style
	currentStyleIndex = (currentStyleIndex - 1 + styles.length) % styles.length;
	updateMapStyle();
});

function updateMapStyle() {
	const styleId = styles[currentStyleIndex];
	// Determine whether the style is a JSON file or a built-in Mapbox style and set the style URL accordingly
	let styleUrl;
	if (styleId === 'adoucett/cjf5k84bp0p7t2rmiwvwikhyn') {
		styleUrl = `mapbox://styles/${styleId}`;
	} else {
		// Use the default Map.mapbox() syntax for the built-in styles
		styleUrl = `mapbox://styles/mapbox/${styleId}`;
	}

	map.setStyle(styleUrl);

	map.once("styledata", () => {
		createRadarLayer(map);
	});
}



// This function creates a draggable marker on the map with the specified coordinates
function createDraggableMarker(map, coordinates) {
	const marker = new mapboxgl.Marker({ draggable: true })
		.setLngLat(coordinates)
		.addTo(map);
	// Add an event listener for when the marker is dragged
	marker.on('dragend', () => {
		// Get the new coordinates after the marker is dragged
		const newCoordinates = marker.getLngLat();
		appendImageToCard(newCoordinates.lat, newCoordinates.lng);
		// Call the geocode function to get weather alerts for the new location
		geocode(`${newCoordinates.lng},${newCoordinates.lat}`).then(coordinates => {
			// If coordinates are returned, log the weather alert for the new location
			if (coordinates) {
				console.log(`Weather alert for new location: ${coordinates}`);
			}

		});
	});
	// Return the marker object
	return marker;
}


// This function initializes the map with the user's current location
function initMapWithCurrentLocation() {
	// Get the user's current position
	navigator.geolocation.getCurrentPosition(
		(position) => {
			// Get the user's coordinates from the position object
			const userCoordinates = [
				position.coords.longitude,
				position.coords.latitude,
			];
			// Initialize the map with the user's coordinates and a specific map style
			initMap(userCoordinates, 'adoucett/cjf5k84bp0p7t2rmiwvwikhyn');
			// Get the latitude and longitude values from the user's coordinates
			const userLat = position.coords.latitude;
			const userLon = position.coords.longitude;
			// Call the appendImageToCard function with the user's latitude and longitude values
			appendImageToCard(userLat, userLon);

			// Wait for the map's style to load before adding the radar layer and controls
			map.on('load', () => {
				createRadarLayer(map);
				addRadarControls(map);
				// Create a draggable marker with the user's coordinates after the map is loaded
				const draggableMarker = createDraggableMarker(map, userCoordinates);
				const toggleMarkerButton = document.getElementById('toggle-marker-button');
				toggleMarkerButton.addEventListener('click', () => {
					/// If the draggable marker is on the map, remove it; otherwise, add it to the map
					if (draggableMarker._map) {
						draggableMarker.remove();
					} else {
						draggableMarker.addTo(map);
					}
				});
			});
		},
		(error) => {
			console.error('Error getting user location:', error);
			// If there is an error getting the user's location, initialize the map with a default location
			const defaultLocation = [-0.127647, 51.507222];
			initMap(defaultLocation, styles[0]);

			// Get the latitude and longitude values from the default location
			const defaultLat = defaultLocation[1];
			const defaultLon = defaultLocation[0];
			// Call the appendImageToCard function with the default latitude and longitude values
			appendImageToCard(defaultLat, defaultLon);
		}
	);
}
// Call the initMapWithCurrentLocation function to initialize the map with the user's current location
initMapWithCurrentLocation();


