// radar.js
import { OPEN_WEATHER_APPID } from './keys.js';

const OPENWEATHERMAP_API_KEY = OPEN_WEATHER_APPID;



export function createRadarLayer(map) {
	map.addSource('radar', {
		type: 'raster',
		tiles: [
			`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OPENWEATHERMAP_API_KEY}`
		],
		tileSize: 256,
		maxzoom: 6,
	});

	map.addLayer({
		id: 'radar-layer',
		type: 'raster',
		source: 'radar',
		paint: {
			'raster-opacity': 0.5, // Set the initial opacity
		},
	});
}



export function addRadarControls(map) {
	// Select the existing toggle button by its ID
	const radarToggleButton = document.getElementById('toggle-radar');
	radarToggleButton.onclick = () => {
		const isVisible = map.getLayoutProperty('radar-layer', 'visibility');
		if (isVisible === 'visible') {
			map.setLayoutProperty('radar-layer', 'visibility', 'none');
		} else {
			map.setLayoutProperty('radar-layer', 'visibility', 'visible');
		}
	};

	// Create a range input for adjusting radar layer opacity
	const radarOpacityInput = document.createElement('input');
	radarOpacityInput.type = 'range';
	radarOpacityInput.min = 0;
	radarOpacityInput.max = 1;
	radarOpacityInput.step = 0.1;
	radarOpacityInput.value = 0.5;
	radarOpacityInput.oninput = (event) => {
		const opacity = parseFloat(event.target.value);
		map.setPaintProperty('radar-layer', 'raster-opacity', opacity);
	};

	// Add the opacity input to the map container or another appropriate container
	const mapContainer = document.getElementById('map');
	mapContainer.appendChild(radarOpacityInput);
}

