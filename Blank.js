// import {fetchCurrentWeather, fetchForecast, fetchWeatherAlert, weatherKeywords} from "./weatherAPI";
// import {createCard} from "./card";
//
// export function appendImageToCard2(lat, lon) {
// 	const cardsContainer = document.getElementById('card-container');
//
// 	// Fetch current weather data and weather alert
// 	Promise.all([fetchCurrentWeather(lat, lon), fetchWeatherAlert(lat, lon)])
// 		.then(([currentWeather, weatherAlert]) => {
// 			// Use current weather description and city name in the Pexels API query
// 			const location = `${currentWeather.city}, ${currentWeather.state}, ${currentWeather.country}`;
// 			let keyword = currentWeather.description.toLowerCase();
// 			if (keyword in weatherKeywords) {
// 				keyword = weatherKeywords[keyword];
// 			} else {
// 				keyword = currentWeather.description;
// 			}
// 			const pexelsUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword + ' ' + currentWeather.city)}&per_page=6&page=${Math.floor(Math.random() * 100)}`;
//
// 			// Fetch forecast data next
// 			fetchForecast(lat, lon)
// 				.then(forecastData => {
// 					// Fetch the images for the current weather
// 					//fetch
// 					fetchImages(pexelsUrl)
// 						.then(imageUrls => {//
// 							// Clear existing cards
// 							cardsContainer.innerHTML = '';
//
// 							// Append current weather card with the weatherAlert
// 							const currentWeatherCard = createCard(imageUrls[0], currentWeather, 'Now', location, weatherAlert, true);
// 							cardsContainer.innerHTML += currentWeatherCard;
//
// 							// Append forecast cards
// 							forecastData.forEach((forecast, index) => {
// 								const forecastCard = createCard(imageUrls[index + 1], forecast, forecast.day, location);
// 								cardsContainer.innerHTML += forecastCard;
// 							});
// 						})//
// 						.catch(error => {
// 							console.error('Error fetching images:', error);
// 						});
// 				})
// 				.catch(error => {
// 					console.error('Error fetching forecast:', error);
// 				});
// 		})
// 		.catch(error => {
// 			console.error('Error fetching current weather and/or weather alert:', error);
// 		});
// }