export function createCard(imageUrl, weather, day) {
	return `
		<div class="card" style="width: 18rem;">
			<img src="${imageUrl}" class="card-img-top" alt="Weather image">
			<div class="card-body">
				<h5 class="card-title">${day} - ${weather.temperature}°C</h5>
				<p class="card-text">${weather.description}</p>
			</div>
		</div>
	`;
}