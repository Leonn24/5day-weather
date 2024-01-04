
// Variables for my API key and API endpoint //
var API_KEY = 'e953ec1ebb99034cdb864ea6aabcf420';
var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?appid=${API_KEY}`;

// Function to render weather info in a container and appends to specific container //
function renderWeather(containerId, data) {
    const container = document.getElementById(containerId);

    const detailsDiv = document.createElement("div");
    detailsDiv.className = "details";
    detailsDiv.innerHTML = `
        <h2>${data.city} (${data.date})</h2>
        <h4>Temperature: ${data.temperature.toFixed(2)}&#176;F</h4>
        <h4>Wind: ${data.wind} MPH</h4>
        <h4>Humidity: ${data.humidity}%</h4>
    `;

    container.appendChild(detailsDiv);

    const iconDiv = document.createElement("div");
    iconDiv.className = "icon";
    iconDiv.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${data.iconCode}.png" alt="weather-icon">
        <h4>${data.description}</h4>
    `;
    container.appendChild(iconDiv);
}


// Function to render weather card in a list and appends to specified list //
function renderWeatherCard(listId, data) {
    const list = document.getElementById(listId);

    const listItem = document.createElement("li");
    listItem.className = "card";
    listItem.innerHTML = `
        <h3>${data.date}</h3>
        <img src="https://openweathermap.org/img/wn/${data.iconCode}.png" alt="weather-icon">
        <h4>Temp: ${data.temperature.toFixed(2)}&#176;F</h4>
        <h4>Wind: ${data.wind} MPH</h4>
        <h4>Humidity: ${data.humidity}%</h4>
    `;

    list.appendChild(listItem);
}


// Function to render current weather data //
function renderCurrentWeather(data) {
    const currentWeatherInfo = document.createElement('div');
    currentWeatherInfo.className = "currentWeatherInfo";
    currentWeatherInfo.innerHTML = `
    <h1>${data.city} ${data.date}<h1>
    <img src="https://openweathermap.org/img/wn/${data.iconCode}.png" alt="weather-icon">
        <h3>Temp: ${data.temperature.toFixed(2)}&#176;F</h3>
        <h3>Wind: ${data.wind} MPH</h3>
        <h3>Humidity: ${data.humidity}%</h3>
    `;
    document.getElementById('currentWeather').innerHTML = '';
    document.getElementById('currentWeather').append(currentWeatherInfo);

}

// Function that converts kelvin to Fahrenheit //
function kelvinToFahrenheit(kelvin) {
    var celsius = kelvin - 273.15;
    var fahrenheit = (celsius * 9 / 5) + 32;
    return fahrenheit;
}

// Function to fetch weather data for a city //
async function fetchWeather(city) {
    return fetch(`${apiUrl}&q=${city}`)

        .then(function (response) {
            return response.json();
        })
        .catch(function (error) {
            console.log(error);
        });
}


// Event listener for search button //
var searchBtn = document.getElementById('search-btn');
searchBtn.addEventListener('click', function (event) {
    event.preventDefault();
    var textInput = document.getElementById('search-text');
    if (textInput.value.trim() === "") {
        alert('Please Search City')
    } else {
        createForecast(textInput.value);
    }


});

// Function to create weather forcast for a city //
async function createForecast(city) {
    var data = await fetchWeather(city);
    createSavedCity(city);

    var currentWeather = document.getElementById('currentWeather');
    currentWeather.innerHTML = '';
    var cardList = document.getElementById('weather-cards');
    cardList.innerHTML = '';
    // array to store forecast dates //
    var forecast = [];

    // loop through the collected weather data //
    for (var i = 0; i < data.list.length; i++) {
        var listItem = data.list[i];
        var forecastDate = listItem.dt_txt.split(' ')[0];

        if (!forecast.includes(forecastDate)) {
            forecast.push(forecastDate);

            // Creates an object with weather data for rendering //
            var weatherData = {
                date: listItem.dt_txt,
                iconCode: listItem.weather[0].icon,
                temperature: kelvinToFahrenheit(listItem.main.temp),
                wind: listItem.wind.speed,
                humidity: listItem.main.humidity,
                description: listItem.weather[0].description,
                city: city,
            };

            if (i === 0) {
                renderCurrentWeather(weatherData);
            } else {
                renderWeatherCard("weather-cards", weatherData);


            }

        }
    }
}

// Function to add city to search history //
function createSavedCity(city) {
    var searchedCity = JSON.parse(localStorage.getItem("searched-city")) || [];

        searchedCity = [city];
        localStorage.setItem("searched-city", JSON.stringify(searchedCity));
        // Update the search history buttons //
        createButtonList(); 
    }


// Function to create and update history buttons //
function createButtonList() {
    var cities = JSON.parse(localStorage.getItem('searched-city')) || [];
    var weatherInput = document.getElementById('weather-input');


    for (let i = 0; i < cities.length; i++) {
        var cityButton = document.createElement('button');
        cityButton.addEventListener('click', function () {
            createForecast(cities[i]);
        });
        cityButton.innerHTML = cities[i];
        weatherInput.appendChild(cityButton);
        
    }
}

// Function called on window load to initi the search history buttons //

window.onload = createButtonList;





