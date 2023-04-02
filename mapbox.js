
import { MAPBOX_API_KEY} from './keys.js';
import { appendImageToCard } from './pexelsAPI.js';

const MAPBOX_ACCESS_TOKEN = MAPBOX_API_KEY;

let map
export function geocode(searchInput) {
	const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchInput)}.json?access_token=${MAPBOX_ACCESS_TOKEN}`;

	return fetch(url)
		.then(response => response.json())
		.then(data => {
			if (data.features.length > 0) {
				const coordinates = data.features[0].geometry.coordinates;
				map.flyTo({
					center: coordinates,
					zoom: 14,
					essential: true
				});
				return coordinates; // Return the coordinates
			} else {
				alert('Location not found. Please try another search.');
				return null;
			}
		})
		.catch(error => {
			console.error("Error fetching geocoding data:", error);
		});
}

export function initMap(centerCoordinates) {
	// Create a new map instance
	map = new mapboxgl.Map({
		container: 'map', // container ID
		style: 'mapbox://styles/adoucett/cjf5k84bp0p7t2rmiwvwikhyn',
		center: centerCoordinates, // starting position [lng, lat]
		zoom: 9 // starting zoom level
	});
}

export function initMapWithCurrentLocation() {
	navigator.geolocation.getCurrentPosition(
		(position) => {
			const userCoordinates = [position.coords.longitude, position.coords.latitude];
			initMap(userCoordinates);

			// Call appendImageToCard with the user's latitude and longitude
			const userLat = position.coords.latitude;
			const userLon = position.coords.longitude;
			appendImageToCard(userLat, userLon);
		},
		(error) => {
			console.error('Error getting user location:', error);
			// Fall back to a default location (e.g., London) if the user's location cannot be determined
			const defaultLocation = [-0.127647, 51.507222];
			initMap(defaultLocation);

			// Call appendImageToCard with the default location's latitude and longitude
			const defaultLat = defaultLocation[1];
			const defaultLon = defaultLocation[0];
			appendImageToCard(defaultLat, defaultLon);
		}
	);
}
