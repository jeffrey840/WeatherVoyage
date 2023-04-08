
import { OPEN_WEATHER_APPID } from './keys.js';

// Set the OpenWeatherMap API key
const OPENWEATHERMAP_API_KEY = OPEN_WEATHER_APPID;

// Function to fetch the current weather for a location given its latitude and longitude
export function fetchCurrentWeather(lat, lon) {
	// Construct the URL for the OpenWeatherMap API request
	const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHERMAP_API_KEY}`;

	// Make the API request and return a Promise that resolves to the weather data
	return fetch(url)
		.then(response => response.json())
		.then(data => {
			// Parse the weather data
			const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
			const date = new Date(data.dt_txt);
			const dayOfWeek = days[date.getDay()];
			const temperatureFahrenheit = (data.main.temp * 9 / 5) + 32;
			const weather = {
				city: data.name,
				country: data.sys.country,
				temperature: data.main.temp,
				description: data.weather[0].description,
				icon: data.weather[0].icon,
				humidity: data.main.humidity,
				windSpeed: data.wind.speed,
				dayOfWeek: dayOfWeek,
				temperatureFahrenheit: temperatureFahrenheit.toFixed(1),
				cityAndDescription: `${data.name} ${data.weather[0].description}`
			};
			return weather;
		})
		.catch(error => {
			console.error("Error fetching weather data:", error);
		});
}

// Function to fetch the forecast for a location given its latitude and longitude
export function fetchForecast(lat, lon) {
	// Construct the URL for the OpenWeatherMap API request
	const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHERMAP_API_KEY}`;

	// Make the API request and return a Promise that resolves to the forecast data
	return fetch(url)
		.then(response => response.json())
		.then(data => {
			// Parse the forecast data
			const forecastData = data.list.filter((item, index) => index % 8 === 0).map(item => {
				const temperatureFahrenheit = (item.main.temp * 9 / 5) + 32;
				const date = new Date(item.dt_txt);
				const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
				const dayOfWeek = days[date.getDay()];

				return {
					date: item.dt_txt.split(' ')[0],
					dayOfWeek: dayOfWeek,
					temperature: item.main.temp,
					temperatureFahrenheit: temperatureFahrenheit.toFixed(1),
					humidity: item.main.humidity,
					windSpeed: item.wind.speed,
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

// Object that maps OpenWeatherMap weather descriptions to more specific keywords for the Pexels API
export const weatherKeywords = {
	'clear sky': 'clear',
	'few clouds': 'partly cloudy',
	'scattered clouds': 'partly cloudy',
	'broken clouds': 'cloudy',
	'overcast clouds': 'overcast',
	'light rain': 'rain',
	'moderate rain': 'rain',
	'heavy intensity rain': 'rain',
	'very heavy rain': 'rain',
	'extreme rain': 'rain',
	'freezing rain': 'rain',
	'light snow': 'snow',
	'moderate snow': 'snow',
	'heavy snow': 'snow',
	'sleet': 'sleet',
	'shower rain': 'rain',
	'thunderstorm': 'thunderstorm',
	'thunderstorm with light rain': 'thunderstorm',
	'thunderstorm with rain': 'thunderstorm',
	'thunderstorm with heavy rain': 'thunderstorm',
	'light thunderstorm': 'thunderstorm',
	'heavy thunderstorm': 'thunderstorm',
	'ragged thunderstorm': 'thunderstorm',
	'thunderstorm with light drizzle': 'thunderstorm',
	'thunderstorm with drizzle': 'thunderstorm',
	'thunderstorm with heavy drizzle': 'thunderstorm',
	'mist': 'fog',
	'smoke': 'smoke',
	'haze': 'haze',
	'sand/ dust whirls': 'dust',
	'fog': 'fog',
	'sand': 'dust',
	'dust': 'dust',
	'volcanic ash': 'ash',
	'squalls': 'windy',
	'tornado': 'tornado'
};