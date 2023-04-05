export function createCard(imageUrl, weather, day) {
	return `
        <div class="card mb-3 w-100">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${imageUrl}" class="card-img" alt="Weather image">
                </div>
                <div class="col-md-8">
	<div class="card-body">
		<h5 class="card-title">${day} - ${weather.temperatureFahrenheit}°F</h5>
		<h5 class="card-title">${day} - ${weather.temperature}°C</h5>
		<p class="card-text">${weather.description}</p>
		<p class="card-text">
			<i class="fa-solid fa-wind"></i> Wind: ${weather.windSpeed} m/s
		</p>
		<p class="card-text">
			<i class="fa-sharp fa-solid fa-droplet"></i> Humidity: ${weather.humidity}%
		</p>
		<p class="card-text">
			<i class="fa-sharp fa-solid fa-droplet"></i> dayof week: ${weather.dayOfWeek}%
		</p>
	</div>
</div>
                </div>
            </div>
        </div>
    `;
}