export function createCard(imageUrl, weather, day, location, weatherAlert = "", hideDayOfWeek = false) {
	return `
        <div class="card mb-3 w-100">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${imageUrl}" class="card-img" alt="Weather image" width="200" height="200">
                </div>
                <div class="col-md-8">
                    <div class="card-body">                       
                        ${hideDayOfWeek ? ` <h5 class="card-title">${location}</h5> ` : ''}
                        <div class="row">
                            <div class="col-md-6">
                                <p class="card-text text-center">${day}</p>
                                <p class="card-title text-center">${weather.temperatureFahrenheit}°F</p>
                                <p class="card-title text-center"> ${weather.temperature}°C</p>
                                <p class="card-text text-center">${weather.description}</p>
                            </div>
                            <div class="col-md-6">
                                ${weatherAlert ? ` <p class="card-text text-danger">Alert: ${weatherAlert}</p> ` : ''}
                                ${!hideDayOfWeek ? `<p class="card-text text-center">
                                    <i class="fa-solid fa-calendar-week "></i> day of the week: ${weather.dayOfWeek}
                                </p>` : ''}                                
                                <p class="card-text text-center">
                                    <i class="fa-solid fa-wind "></i> Wind: ${weather.windSpeed} m/s
                                </p>
                                <p class="card-text text-center">
                                    <i class="fa-sharp fa-solid fa-droplet "></i> Humidity: ${weather.humidity}%
                                </p> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
