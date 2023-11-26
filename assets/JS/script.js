var API_KEY = 'e953ec1ebb99034cdb864ea6aabcf420'
var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?&appid=${API_KEY}`


// Function to create and append weather details to the specified container
function renderWeather(containerId, data) {
    const container = document.getElementById(containerId);

    // Create details div
    const detailsDiv = document.createElement("div");
    detailsDiv.className = "details";
    detailsDiv.innerHTML = `
        <h2>${data.city} (${data.date})</h2>
        <h4>Temperature: ${data.temperature.toFixed(2)}&#176;F</h4>
        <h4>Wind: ${data.wind} MPH</h4>
        <h4>Humidity: ${data.humidity}%</h4>
    `;
    container.appendChild(detailsDiv);

    // Create icon div
    const iconDiv = document.createElement("div");
    iconDiv.className = "icon";
    iconDiv.innerHTML = `
        <img src="${data.iconUrl}" alt="weather-icon">
        <h4>${data.description}</h4>
    `;
    container.appendChild(iconDiv);
}



// Function to create and append a weather card to the specified list
function renderWeatherCard(listId, data) {
    const list = document.getElementById(listId);

    // Create list item (li) element
    const listItem = document.createElement("li");
    listItem.className = "card";
    listItem.innerHTML = `
        <h3>${data.date}</h3>
        <img src="${data.iconUrl}" alt="weather-icon">
        <h4>Temp: ${data.temperature.toFixed(2)}&#176;F</h4>
        <h4>Wind: ${data.wind} MPH</h4>
        <h4>Humidity: ${data.humidity}%</h4>
    `;

    // Append the list item to the list
    list.appendChild(listItem);
}


async function fetchWeather (city) {
  return await fetch(`${apiUrl}&q=${city}`)

   .then(function (response){
    return  response.json();
   })
   .catch(function (error){
      console.log(error)
   })
   

}

var searchBtn = document.getElementById('search-btn')
searchBtn.addEventListener('click', async function() {
    
    var textInput = document.getElementById('search-text')
    // readd function
    createForecast(textInput.value)
});

async function createForecast (city) {
    var data = await fetchWeather(city)
    createSavedCity(city);
  
    
    var forecast = [];
    var cardList = document.getElementById('weather-cards')
    cardList.innerHTML = '';
    for (var i = 0; i < data.list.length; i++) {
      var listItem = data.list[i];
      var forcastCurrentDate = listItem.dt_txt.split(' ')[0];

     
     
        if (!forecast.includes(forcastCurrentDate)) {
            forecast.push(forcastCurrentDate);
          var weatherData = {
              date: listItem.dt_txt,
              iconUrl: "https://openweathermap.org/img/wn/10d@2x.png",
              temperature: kelvinToFahrenheit(listItem.main.temp),
              wind: listItem.wind.speed,
              humidity: listItem.main.humidity,
          };
      
        
          renderWeatherCard("weather-cards", weatherData);
        }

    }
}

function createSavedCity(city)  {
    
    var searchedCity = JSON.parse(localStorage.getItem("searched-city"));
    
    if (searchedCity == undefined) {
      searchedCity = [];
    }
    
    if (!searchedCity.includes(city)) {
        searchedCity.push(city)
        localStorage.setItem("searched-city", JSON.stringify(searchedCity));


    }
}

function createButtonList () {
    // Get list from local storage
    var cities = JSON.parse(localStorage.getItem('searched-city'));


    // create for loop 
    for (let i = 0; i < cities.length; i++) {
       var cityButton = document.createElement('button')
       cityButton.addEventListener('click', function (){
      
        createForecast(cities[i])

       })
       cityButton.innerHTML = cities[i] 
       var weatherInput = document.getElementById('weather-input')
       weatherInput.append(cityButton)
    }

    // create button for list
    
    // append to html
}


function kelvinToFahrenheit(kelvin) {
    var celsius = kelvin - 273.15;
    var fahrenheit = (celsius * 9/5) + 32;
    return fahrenheit;
}

createButtonList();




// functionality for icon
// figure out how to pass a date to the api 
// Main card = todays date
// create a function to fetch only todays date
// example 'fetchWeather'
// pass data into 'renderWeather'
// list = rest of week = 5