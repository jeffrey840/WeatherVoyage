import { appendImageToCard  } from './pexelsAPI.js';
import { geocode } from './mapbox.js';

// Listen for the search form submission event
document.getElementById('search-form').addEventListener('submit', (e) => {
	e.preventDefault(); // Prevent the default form submission behavior

	// Get the search input value and use the Mapbox API to get the coordinates
	const searchInput = document.getElementById('search-input').value;
	geocode(searchInput)
		.then(coordinates => {
			if (coordinates) {
				// If coordinates are found, use the Pexels API to fetch new weather data and update the card
				appendImageToCard(coordinates[1], coordinates[0]);
			}
		})
		.catch(error => {
			console.error("Error updating weather card:", error);
		});
});

// Toggle the search form visibility
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

// Toggle the 5 day forecast visibility
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

$(document).ready(function() {
	$('.btn').click(function() {
		$(this).addClass('btn-bounce');
		setTimeout(() => $(this).removeClass('btn-bounce'), 900);
	});
});


