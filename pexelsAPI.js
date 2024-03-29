
import {PEXEL_API_KEY} from './keys.js';
const PEXELS_API_KEY = PEXEL_API_KEY;

import { fetchCurrentWeather, fetchForecast, weatherKeywords, fetchWeatherAlert } from './weatherAPI.js';

import { createCard } from './card.js';

export function appendImageToCard(lat, lon) {
	// Fetch current weather data and weather alert
	Promise.all([fetchCurrentWeather(lat, lon), fetchWeatherAlert(lat, lon)])
		.then(([currentWeather, weatherAlert]) => {
			// Use current weather description and city name in the Pexels API query
			const location = `${currentWeather.city}, ${currentWeather.state}, ${currentWeather.country}`;
			let keyword = currentWeather.description.toLowerCase();
			if (keyword in weatherKeywords) {
				keyword = weatherKeywords[keyword];
			} else {
				keyword = currentWeather.description;
			}
			const pexelsUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword + ' ' + currentWeather.city)}&per_page=6&page=${Math.floor(Math.random() * 100)}`;

			// Fetch forecast data next
			fetchForecast(lat, lon)
				.then(forecastData => {
					// Fetch the images for the current weather and forecast data
					fetch(pexelsUrl, {
						headers: {
							'Authorization': PEXELS_API_KEY
						}
					})
						.then(response => response.json())
						.then(response => {
							// Extract the image URLs from the Pexels API response
							const imageUrls = response.photos.map(photo => photo.src.large);

							// Create cards for both the current weather and the forecast data
							const currentWeatherCard = createCard(imageUrls[0], currentWeather, 'Now', location, weatherAlert, true);

							const forecastCards = forecastData.map((day, index) => {
								return createCard(imageUrls[index + 1], day, day.date, location, null, false);
							});
							// Combine the cards into a single string and add them to the card container
							const cards = [currentWeatherCard, ...forecastCards].join('');
							const cardContainer = document.getElementById('card-container');
							cardContainer.innerHTML = cards;
						})
						.catch(error => {
							console.error("Error fetching images from Pexels:", error);
						});
				})
				.catch(error => {
					console.error("Error fetching forecast data:", error);
				});
		})
		.catch(error => {
			console.error("Error fetching weather data and/or weather alert:", error);
		});
}

