//
// import './keys.js';
// import './weatherAPI.js';
// import './pexelsAPI.js';
// import './keywords.js';
// import './card.js';
// import './mapbox.js';
//
//
// // import { initMapWithCurrentLocation } from './mapbox.js';
// // import { geocode } from './mapbox.js';
// // import { appendImageToCard } from './pexelsAPI.js';
// // import {MAPBOX_API_KEY} from "./keys";
//
// // const MAPBOX_ACCESS_TOKEN = MAPBOX_API_KEY;
//
// let map;
//
// mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
//
// document.getElementById('search-form').addEventListener('submit', (e) => {
// 	e.preventDefault();
// 	const searchInput = document.getElementById('search-input').value;
// 	geocode(searchInput)
// 		.then(coordinates => {
// 			if (coordinates) {
// 				// Fetch new weather data and update the card
// 				appendImageToCard(coordinates[1], coordinates[0]);
// 			}
// 		})
// 		.catch(error => {
// 			console.error("Error updating weather card:", error);
// 		});
// });
//
// initMapWithCurrentLocation();
//
// const searchForm = document.getElementById('search-form');
// const toggleSearchButton = document.getElementById('toggle-search-button');
// const icon = document.querySelector('#toggle-search-button i');
//
// toggleSearchButton.addEventListener('click', () => {
// 	searchForm.classList.toggle('hidden');
// 	if (searchForm.classList.contains('hidden')) {
// 		icon.style.color = '#00f0a8'; // change color to green
// 	} else {
// 		icon.style.color = '#ff3d00'; // change color to red
// 	}
// });
//
//
