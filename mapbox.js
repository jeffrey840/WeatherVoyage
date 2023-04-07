
import { MAPBOX_API_KEY} from './keys.js';
import { appendImageToCard } from './pexelsAPI.js';
import { createRadarLayer, addRadarControls } from './radar.js'; // Add this line

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
const styles = [
	'streets-v11',
	'navigation-night-v1',
	'outdoors-v11',
	'satellite-streets-v12',
	'styles/x-ray.JSON',
	'adoucett/cjf5k84bp0p7t2rmiwvwikhyn',
	// 'style/',
	// 'style/',

];
//delete camouiflage, dark matter, other, style

toggleMapButton.addEventListener("click", () => {
	currentStyleIndex = (currentStyleIndex + 1) % styles.length;
	const styleId = styles[currentStyleIndex];

	if (styleId.endsWith(".JSON" || ".json")) {
		// Use the relative path for the JSON style
		map.setStyle(styleId);
	} else {
		// Use the default Map.mapbox() syntax for the built-in styles
		map.setStyle(`map//styles/map/mapbox/${styleId}`);
	}

	map.setStyle(`mapbox://styles/mapbox/${styleId}`);

	map.once("styledata", () => {
		createRadarLayer(map);
	});
});
//other.json works , x-ray works
function createDraggableMarker(map, coordinates) {
	const marker = new mapboxgl.Marker({ draggable: true })
		.setLngLat(coordinates)
		.addTo(map);

	marker.on('dragend', () => {
		const newCoordinates = marker.getLngLat();
		appendImageToCard(newCoordinates.lat, newCoordinates.lng);
	});

	return marker;
}

function initMapWithCurrentLocation() {
	navigator.geolocation.getCurrentPosition(
		(position) => {
			const userCoordinates = [
				position.coords.longitude,
				position.coords.latitude,
			];
			initMap(userCoordinates, 'adoucett/cjf5k84bp0p7t2rmiwvwikhyn');

			const userLat = position.coords.latitude;
			const userLon = position.coords.longitude;
			appendImageToCard(userLat, userLon);

			// Wait for the map's style to load before adding the radar layer and controls
			map.on('load', () => {
				createRadarLayer(map);
				addRadarControls(map);
				// Create the draggable marker after the map is loaded
				const draggableMarker = createDraggableMarker(map, userCoordinates);
				const toggleMarkerButton = document.getElementById('toggle-marker-button');
				toggleMarkerButton.addEventListener('click', () => {
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
			const defaultLocation = [-0.127647, 51.507222];
			initMap(defaultLocation, styles[0]);

			const defaultLat = defaultLocation[1];
			const defaultLon = defaultLocation[0];
			appendImageToCard(defaultLat, defaultLon);
		}
	);
}

initMapWithCurrentLocation();


