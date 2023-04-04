
import { appendImageToCard  } from './pexelsAPI.js';

import { geocode } from './mapbox.js';

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

const searchForm = document.getElementById('search-form');
const toggleSearchButton = document.getElementById('toggle-search-button');
const icon = document.querySelector('#toggle-search-button i');

toggleSearchButton.addEventListener('click', () => {
	searchForm.classList.toggle('hidden');
	if (searchForm.classList.contains('hidden')) {
		icon.style.color = '#00f0a8'; // change color to green
	} else {
		icon.style.color = '#ff3d00'; // change color to red
	}
});

const toggleCardsButton = document.getElementById('toggle-cards-button');
toggleCardsButton.addEventListener('click', () => {
	const cardContainer = document.getElementById('card-container');
	if (cardContainer.classList.contains('hidden')) {
		cardContainer.classList.remove('hidden');
		toggleCardsButton.textContent = 'Hide 5 day forecast';
	} else {
		cardContainer.classList.add('hidden');
		toggleCardsButton.textContent = 'Show 5 day forecast';
	}
});




