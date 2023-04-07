
import { MAPBOX_API_KEY} from './keys.js';
import { appendImageToCard } from './pexelsAPI.js';

const MAPBOX_ACCESS_TOKEN = MAPBOX_API_KEY;

let map;

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

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

function initMap(centerCoordinates, styleId) {
	let styleUrl = `mapbox://styles/mapbox/${styleId}`;
	if (styleId === 'adoucett/cjf5k84bp0p7t2rmiwvwikhyn') {
		styleUrl = `mapbox://styles/${styleId}`;
	}

	map = new mapboxgl.Map({
		container: 'map',
		style: styleUrl,
		center: centerCoordinates,
		zoom: 9
	});
}

//mapbox://styles/adoucett/cjf5k84bp0p7t2rmiwvwikhyn

//mapbox://styles/mapbox/navigation-night-v1

const toggleMapButton = document.getElementById('toggle-map-button');
let currentStyleIndex = 0;
const styles = ['streets-v11','navigation-night-v1', 'outdoors-v11', 'light-v10', 'dark-v10', 'satellite-streets-v12','v1/adoucett/cjf5k84bp0p7t2rmiwvwikhyn'];

toggleMapButton.addEventListener('click', () => {
	currentStyleIndex = (currentStyleIndex + 1) % styles.length;
	const styleId = styles[currentStyleIndex];
	map.setStyle(`mapbox://styles/mapbox/${styleId}`);
});

function initMapWithCurrentLocation() {
	navigator.geolocation.getCurrentPosition(
		(position) => {
			const userCoordinates = [position.coords.longitude, position.coords.latitude];
			initMap(userCoordinates, 'adoucett/cjf5k84bp0p7t2rmiwvwikhyn'); // Call initMap() with the custom style ID

			// Call appendImageToCard with the user's latitude and longitude
			const userLat = position.coords.latitude;
			const userLon = position.coords.longitude;
			appendImageToCard(userLat, userLon);
		},
		(error) => {
			console.error('Error getting user location:', error);
			// Fall back to a default location (e.g., London) if the user's location cannot be determined
			const defaultLocation = [-0.127647, 51.507222];
			initMap(defaultLocation, styles[0]);

			// Call appendImageToCard with the default location's latitude and longitude
			const defaultLat = defaultLocation[1];
			const defaultLon = defaultLocation[0];
			appendImageToCard(defaultLat, defaultLon);
		}
	);
}

initMapWithCurrentLocation();
