const apiKey = "390ba23467b40881451c96ed026f0eba";

async function getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    const resultDiv = document.getElementById("weatherResult");

    if (city === "") {
        resultDiv.innerHTML = "<p style='color:red;'>Please enter a city name!</p>";
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        // Show loading
        resultDiv.innerHTML = "<p>Loading...</p>";

        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === "404") {
            resultDiv.innerHTML = "<p style='color:red;'>City not found!</p>";
            return;
        }

        const weatherHTML = `
            <h2>${data.name}</h2>
            <p>Temperature: ${data.main.temp} °C</p>
            <p>Weather: ${data.weather[0].description}</p>
            <p>Humidity: ${data.main.humidity}%</p>
        `;

        resultDiv.innerHTML = weatherHTML;

    } catch (error) {
        resultDiv.innerHTML = "<p style='color:red;'>Something went wrong!</p>";
        console.log("Error:", error);
    }
}