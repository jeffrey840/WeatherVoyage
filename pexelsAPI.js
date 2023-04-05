
import {PEXEL_API_KEY} from './keys.js';
const PEXELS_API_KEY = PEXEL_API_KEY;

import { fetchCurrentWeather, fetchForecast, weatherKeywords } from './weatherAPI.js';

import { createCard } from './card.js';

export function appendImageToCard(lat, lon) {
	// Fetch current weather data first
	fetchCurrentWeather(lat, lon)
		.then(currentWeather => {
			// Use current weather description and city name in the Pexels API query
			let keyword = currentWeather.description.toLowerCase();
			if (keyword in weatherKeywords) {
				keyword = weatherKeywords[keyword];
			} else {
				keyword = currentWeather.description;
			}
			const pexelsUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword + ' ' + currentWeather.city)}&per_page=1&page=${Math.floor(Math.random() * 100)}`;

			// Fetch forecast data next
			fetchForecast(lat, lon)
				.then(forecastData => {
					// Create an array of Pexels API URLs to fetch images for each forecast day
					const pexelsUrls = forecastData.map(day => {
						let keyword = day.description.toLowerCase();
						if (keyword in weatherKeywords) {
							keyword = weatherKeywords[keyword];
						} else {
							keyword = day.description;
						}
						return `https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword + ' ' + currentWeather.city)}&per_page=1&page=${Math.floor(Math.random() * 100)}`;
					});

					// Add the current weather URL to the array of Pexels API URLs
					pexelsUrls.unshift(pexelsUrl);

					// Use Promise.all() to fetch all the images at once
					Promise.all(pexelsUrls.map(url => {
						return fetch(url, {
							headers: {
								'Authorization': PEXELS_API_KEY
							}
						})
							.then(response => response.json())
					}))
						.then(responses => {
							// Extract the image URLs from each Pexels API response
							const imageUrls = responses.map(response => {
								return response.photos[0].src.large;
							});

							// Create cards for both the current weather and the forecast data
							const currentWeatherCard = createCard(imageUrls[0], currentWeather, 'Now');
							const forecastCards = forecastData.map((day, index) => {
								return createCard(imageUrls[index+1], day, day.date);
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
			console.error("Error fetching weather data:", error);
		});
}