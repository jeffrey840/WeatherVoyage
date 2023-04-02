
export function createCard(imageUrl, weather, day) {
	return `
    <div class="card mb-3 col-6 col-md-3">
      <div class="row g-0">
        <div class="col-md-4">
          <img src="${imageUrl}" class="card-img" alt="Weather image">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${day} - ${weather.temperature}°C</h5>
            <p class="card-text">${weather.description}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}