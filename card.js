export function createCard(imageUrl, weather, day, hideDayOfWeek = false) {
	return `
        <div class="card mb-3 w-100">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${imageUrl}" class="card-img" alt="Weather image">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <p class="card-text">${day}</p>
                                <p class="card-title">${weather.temperatureFahrenheit}°F</p>
                                <p class="card-title"> ${weather.temperature}°C</p>
                                <p class="card-text">${weather.description}</p>
                            </div>
                            <div class="col-md-6">
                                <p class="card-text">
                                    <i class="fa-solid fa-wind"></i> Wind: ${weather.windSpeed} m/s
                                </p>
                                <p class="card-text">
                                    <i class="fa-sharp fa-solid fa-droplet"></i> Humidity: ${weather.humidity}%
                                </p>
                                ${!hideDayOfWeek ? `<p class="card-text">
                                    <i class="fa-solid fa-calendar-week"></i> day of week: ${weather.dayOfWeek}
                                </p>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
