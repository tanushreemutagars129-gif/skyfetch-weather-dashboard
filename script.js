function WeatherApp() {
    this.apiKey = "390ba23467b40881451c96ed026f0eba";

    this.cityInput = document.getElementById("cityInput");
    this.searchBtn = document.getElementById("searchBtn");
    this.weatherResult = document.getElementById("weatherResult");
    this.recentList = document.getElementById("recentList");
    this.clearBtn = document.getElementById("clearHistory");
}

WeatherApp.prototype.init = function () {
    this.searchBtn.addEventListener("click", this.handleSearch.bind(this));
    this.clearBtn.addEventListener("click", this.clearHistory.bind(this));

    this.displayRecentSearches();
    this.loadLastCity();
};

WeatherApp.prototype.handleSearch = function () {
    const city = this.cityInput.value.trim();
    if (!city) {
        alert("Please enter a city name!");
        return;
    }
    this.getWeather(city);
};

WeatherApp.prototype.getWeather = async function (city) {
    try {
        this.weatherResult.innerHTML = "<p>Loading...</p>";

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

        this.saveRecentSearch(city);

    } catch (error) {
        this.weatherResult.innerHTML = `<p style="color:red;">${error.message}</p>`;
    }
};

WeatherApp.prototype.displayWeather = function (data) {
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

WeatherApp.prototype.processForecastData = function (data) {
    const daily = data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );
    return daily.slice(0, 5);
};

WeatherApp.prototype.displayForecast = function (forecastArray) {
    const container = document.getElementById("forecastContainer");
    container.innerHTML = "";

    forecastArray.forEach(day => {
        const date = new Date(day.dt_txt);
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

        const icon = day.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        container.innerHTML += `
            <div class="forecast-card">
                <h4>${dayName}</h4>
                <img src="${iconUrl}">
                <p>${day.main.temp} °C</p>
                <p>${day.weather[0].description}</p>
            </div>
        `;
    });
};

WeatherApp.prototype.loadRecentSearches = function () {
    const stored = localStorage.getItem("recentSearches");
    return stored ? JSON.parse(stored) : [];
};

WeatherApp.prototype.saveRecentSearch = function (city) {
    let searches = this.loadRecentSearches();

    city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

    searches = searches.filter(c => c !== city);
    searches.unshift(city);

    if (searches.length > 5) {
        searches.pop();
    }

    localStorage.setItem("recentSearches", JSON.stringify(searches));
    localStorage.setItem("lastCity", city);

    this.displayRecentSearches();
};

WeatherApp.prototype.displayRecentSearches = function () {
    const searches = this.loadRecentSearches();
    this.recentList.innerHTML = "";

    searches.forEach(city => {
        const btn = document.createElement("button");
        btn.textContent = city;
        btn.addEventListener("click", () => {
            this.cityInput.value = city;
            this.getWeather(city);
        });
        this.recentList.appendChild(btn);
    });
};

WeatherApp.prototype.loadLastCity = function () {
    const lastCity = localStorage.getItem("lastCity");
    if (lastCity) {
        this.cityInput.value = lastCity;
        this.getWeather(lastCity);
    }
};

WeatherApp.prototype.clearHistory = function () {
    localStorage.removeItem("recentSearches");
    localStorage.removeItem("lastCity");
    this.displayRecentSearches();
};

const app = new WeatherApp();
app.init();