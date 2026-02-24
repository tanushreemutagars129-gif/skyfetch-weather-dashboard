const apiKey = "390ba23467b40881451c96ed026f0eba;

function getWeather() {
    const city = document.getElementById("cityInput").value;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === "404") {
                document.getElementById("weatherResult").innerHTML = "City not found!";
                return;
            }

            const weatherHTML = `
                <h2>${data.name}</h2>
                <p>Temperature: ${data.main.temp} °C</p>
                <p>Weather: ${data.weather[0].description}</p>
                <p>Humidity: ${data.main.humidity}%</p>
            `;

            document.getElementById("weatherResult").innerHTML = weatherHTML;
        })
        .catch(error => {
            console.log("Error:", error);
        });
}