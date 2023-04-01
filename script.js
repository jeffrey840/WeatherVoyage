
const PEXELS_API_KEY = PEXEL_API_KEY;

const OPENWEATHERMAP_API_KEY = OPEN_WEATHER_APPID;

const MAPBOX_ACCESS_TOKEN = MAPBOX_API_KEY;

function fetchCurrentWeather(location) {
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${OPENWEATHERMAP_API_KEY}`;

	return fetch(url)
		.then(response => response.json())
		.then(data => {
			const weather = {
				city: data.name,
				country: data.sys.country,
				temperature: data.main.temp,
				description: data.weather[0].description,
				icon: data.weather[0].icon
			};
			return weather;
		})
		.catch(error => {
			console.error("Error fetching weather data:", error);
		});
}


function appendImageToCard() {
	const url = `https://api.pexels.com/v1/search?query=weather&per_page=1&page=${Math.floor(Math.random() * 100)}`;

	fetch(url, {
		headers: {
			'Authorization': PEXELS_API_KEY
		}
	})
		.then(response => response.json())
		.then(data => {
			const imageUrl = data.photos[0].src.large;
			return fetchCurrentWeather("London") // Replace "London" with the desired location
				.then(weather => {
					createCard(imageUrl, weather);
				});
		})
		.catch(error => {
			console.error("Error fetching image from Pexels:", error);
		});
}



function createCard(imageUrl, weather) {
	const cardContainer = document.getElementById('card-container');

	const card = `
    <div class="card" style="width: 18rem;">
      <img src="${imageUrl}" class="card-img-top" alt="Weather image">
      <div class="card-body">
        <h5 class="card-title">${weather.city}, ${weather.country} - ${weather.temperature}°C</h5>
        <p class="card-text">${weather.description}</p>
      </div>
    </div>
  `;

	cardContainer.innerHTML = card;
}

appendImageToCard();


// Initialize Mapbox GL
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

// // Create a new map instance
// const map = new mapboxgl.Map({
// 	container: 'map', // container ID
// 	style: 'mapbox://styles/mapbox/streets-v11', // style URL
// 	center: [-0.127647, 51.507222], // starting position [lng, lat]
// 	zoom: 9 // starting zoom level
// });

//search functionality
function geocode(searchInput) {
	const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchInput)}.json?access_token=${MAPBOX_ACCESS_TOKEN}`;

	fetch(url)
		.then(response => response.json())
		.then(data => {
			if (data.features.length > 0) {
				const coordinates = data.features[0].geometry.coordinates;
				map.flyTo({
					center: coordinates,
					zoom: 14,
					essential: true
				});
			} else {
				alert('Location not found. Please try another search.');
			}
		})
		.catch(error => {
			console.error("Error fetching geocoding data:", error);
		});
}

document.getElementById('search-form').addEventListener('submit', (e) => {
	e.preventDefault();
	const searchInput = document.getElementById('search-input').value;
	geocode(searchInput);
});


function initMapWithCurrentLocation() {
	navigator.geolocation.getCurrentPosition(
		(position) => {
			const userCoordinates = [position.coords.longitude, position.coords.latitude];
			initMap(userCoordinates);
		},
		(error) => {
			console.error('Error getting user location:', error);
			alert('We could not get your location. The map will start at a default location.');
			// Fall back to a default location (e.g., London) if the user's location cannot be determined
			initMap([-0.127647, 51.507222]);
		}
	);
}

function initMap(centerCoordinates) {
	// Create a new map instance
	const map = new mapboxgl.Map({
		container: 'map', // container ID
		style: 'mapbox://styles/mapbox/streets-v11', // style URL
		center: centerCoordinates, // starting position [lng, lat]
		zoom: 9 // starting zoom level
	});
}

initMapWithCurrentLocation();


