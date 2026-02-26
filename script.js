function WeatherApp() {
    this.apiKey = "390ba23467b40881451c96ed026f0eba";

    this.cityInput = document.getElementById("cityInput");
    this.searchBtn = document.getElementById("searchBtn");
    this.weatherResult = document.getElementById("weatherResult");
}

WeatherApp.prototype.init = function() {
    this.searchBtn.addEventListener("click", this.handleSearch.bind(this));
    this.showWelcome();
};

WeatherApp.prototype.showWelcome = function() {
    this.weatherResult.innerHTML = "<p>Search for a city to see weather details</p>";
};

WeatherApp.prototype.handleSearch = function() {
    const city = this.cityInput.value.trim();

    if (!city) {
        this.showError("Please enter a city name!");
        return;
    }

    this.getWeather(city);
};

WeatherApp.prototype.getWeather = async function(city) {
    try {
        this.showLoading();

        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}&units=metric`;

        const [weatherRes, forecastRes] = await Promise.all([
            fetch(weatherUrl),
            fetch(forecastUrl)
        ]);

        if (!weatherRes.ok || !forecastRes.ok) {
            throw new Error("City not found!");
        }

        const weatherData = await weatherRes.json();
        const forecastData = await forecastRes.json();

        this.displayWeather(weatherData);

        const processedForecast = this.processForecastData(forecastData);
        this.displayForecast(processedForecast);

    } catch (error) {
        this.showError(error.message);
    }
};

WeatherApp.prototype.displayWeather = function(data) {
    this.weatherResult.innerHTML = `
        <h2>${data.name}</h2>
        <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
        <p><strong>Weather:</strong> ${data.weather[0].description}</p>
        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
        <hr>
        <h3>5-Day Forecast</h3>
        <div id="forecastContainer"></div>
    `;
};

WeatherApp.prototype.processForecastData = function(data) {
    const dailyData = data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    return dailyData.slice(0, 5);
};

WeatherApp.prototype.displayForecast = function(forecastArray) {
    const forecastContainer = document.getElementById("forecastContainer");

    forecastArray.forEach(day => {
        const date = new Date(day.dt_txt);
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

        const icon = day.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        forecastContainer.innerHTML += `
            <div class="forecast-card">
                <h4>${dayName}</h4>
                <img src="${iconUrl}" alt="weather icon">
                <p>${day.main.temp} °C</p>
                <p>${day.weather[0].description}</p>
            </div>
        `;
    });
};

WeatherApp.prototype.showLoading = function() {
    this.weatherResult.innerHTML = "<p>Loading...</p>";
};

WeatherApp.prototype.showError = function(message) {
    this.weatherResult.innerHTML = `<p style="color:red;">${message}</p>`;
};

const app = new WeatherApp();
app.init();