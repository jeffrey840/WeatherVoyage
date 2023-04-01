
const PEXELS_API_KEY = PEXEL_API_KEY;

const OPENWEATHERMAP_API_KEY = OPEN_WEATHER_APPID;

const MAPBOX_ACCESS_TOKEN = MAPBOX_API_KEY;

let map;

function fetchCurrentWeather(lat, lon) {
	const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHERMAP_API_KEY}`;

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

function fetchForecast(lat, lon) {
	const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHERMAP_API_KEY}`;

	return fetch(url)
		.then(response => response.json())
		.then(data => {
			// Extract the forecast data for the next 5 days
			const forecastData = data.list.filter((item, index) => index % 8 === 0).map(item => {
				return {
					date: item.dt_txt.split(' ')[0],
					temperature: item.main.temp,
					description: item.weather[0].description,
					icon: item.weather[0].icon
				}
			});

			if (forecastData.length === 0) {
				throw new Error('No forecast data available');
			}

			return forecastData;
		})
		.catch(error => {
			console.error("Error fetching forecast data:", error);
			throw error;
		});
}




function appendImageToCard(lat, lon) {
	// Fetch current weather data first
	fetchCurrentWeather(lat, lon)
		.then(currentWeather => {
			// Use current weather description in the Pexels API query
			const pexelsUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(currentWeather.description)}&per_page=1&page=${Math.floor(Math.random() * 100)}`;

			fetch(pexelsUrl, {
				headers: {
					'Authorization': PEXELS_API_KEY
				}
			})
				.then(response => response.json())
				.then(data => {
					const imageUrl = data.photos[0].src.large;
					// Fetch forecast data next
					fetchForecast(lat, lon)
						.then(forecastData => {
							// Create cards for both the current weather and the forecast data
							const currentWeatherCard = createCard(imageUrl, currentWeather);
							const forecastCards = forecastData.map(day => createCard(`https://openweathermap.org/img/w/${day.icon}.png`, day));

							// Combine the cards into a single string and add them to the card container
							const cards = [currentWeatherCard, ...forecastCards].join('');
							const cardContainer = document.getElementById('card-container');
							cardContainer.innerHTML = cards;
						})
						.catch(error => {
							console.error("Error fetching forecast data:", error);
						});
				})
				.catch(error => {
					console.error("Error fetching image from Pexels:", error);
				});
		})
		.catch(error => {
			console.error("Error fetching weather data:", error);
		});
}




function createCard(imageUrl, weather) {
	return `
    <div class="card" style="width: 18rem;">
      <img src="${imageUrl}" class="card-img-top" alt="Weather image">
      <div class="card-body">
        <h5 class="card-title">${weather.city}, ${weather.country} - ${weather.temperature}°C</h5>
        <p class="card-text">${weather.description}</p>
      </div>
    </div>
  `;
}


// appendImageToCard();


// Initialize Mapbox GL
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;


//search functionality
function geocode(searchInput) {
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

document.getElementById('search-form').addEventListener('submit', (e) => {
	e.preventDefault();
	const searchInput = document.getElementById('search-input').value;
	geocode(searchInput)
		.then(coordinates => {
			if (coordinates) {
				// Fetch new weather data and update the card
				appendImageToCard(coordinates[1], coordinates[0]);
			}
		})
		.catch(error => {
			console.error("Error updating weather card:", error);
		});
});



function initMap(centerCoordinates) {
	// Create a new map instance
	map = new mapboxgl.Map({
		container: 'map', // container ID
		style: 'mapbox://styles/mapbox/streets-v11', // style URL
		center: centerCoordinates, // starting position [lng, lat]
		zoom: 9 // starting zoom level
	});
}

// initMapWithCurrentLocation();

function initMapWithCurrentLocation() {
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

initMapWithCurrentLocation();
