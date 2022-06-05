// search button
let searchBtn = $('#searchBtn');
// city htmlEl
let cityEl = $('#city-value');
// temp htmlEl
let tempEl = $('#temp-value');
// wind htmlEl
let windEl = $('#wind-value');
// humidity htmlEl
let humidityEl = $('#humidity-value');
// uv index htmlEl
let uviEl = $('#uvi-value');

let fiveDayForecast = $('#five-day-forecast');

//current day
let currentDay = moment().format(' DD/MM/YYYY');//capital 24 hour

// 5 day forecast
let searchHistory = JSON.parse(localStorage.getItem('history')) || [];
console.log(searchHistory);

// my api key
let apiKey = "d47e097f5d363d7b0b0a962b12e789dc";

// event listener button to capture user input to local storage
searchBtn.on('click', function (event) {
    event.preventDefault();
    let userInput = $("#userInput").val().toLowerCase();
    // console.log(searchBtn);
    // // city input
    // let cityInput = $('#userInput').val();
    // cities.push(cityInput);
    // //store city input in local storage
    // localStorage.setItem('cities', JSON.stringify(cities));
    searchCityCurrentWeather(userInput);
});

onStart();

function onStart() {
    renderHistory(true)
};

function capitalizeWords(str) {
    const strArr = str.split(' ');
    let capWords = [];

    for (let i = 0; i < strArr.length; i++) {
        let firstLetter = strArr[i].substring(0, 1).toUpperCase();
        let restOfWord = firstLetter + strArr[i].substring(1, strArr[i].length);
        capWords.push(restOfWord);
    };

    return capWords.join(" ");
}

function renderHistory(onLoad, newCity) {
    let searchHistoryEl = $("#searchHistory");
    if (onLoad) {
        //limit searchHistory to 6 entries only
        for (let i = 0; i < 6; i++) {
            let liEl = $("<li>");
            let searchBtn = $("<button>");
            searchBtn.text(capitalizeWords(searchHistory[i]));
            searchBtn.addClass('search btn btn-outline-dark btn-block');
            liEl.append(searchBtn);
            searchHistoryEl.append(liEl);
        };
    } else {
        let liEl = $("<li>");
        let searchBtn = $("<button>");
        searchBtn.text(capitalizeWords(newCity));
        searchBtn.addClass('search btn btn-outline-dark btn-block');
        liEl.append(searchBtn);
        searchHistoryEl.append(liEl)
    };
};


function searchCityCurrentWeather(city) {
    const endpoint = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial";
    fetch(endpoint)
        .then(function (turnToJson) {
            return turnToJson.json();
        })
        .then(function (response) {
            console.log(response);
            cityEl.text(response.name + currentDay)
            tempEl.text(response.main.temp + ' °F')
            windEl.text(response.wind.speed + ' MPH')
            humidityEl.text(response.main.humidity + ' %')
            searchOneCallAPI(response.coord.lat, response.coord.lon, city)
            // let h4El = $("<h4>");
            // h4El.text(response.name);
            // currentWeather.append(h3El);
        });
};

function searchOneCallAPI(lat, lon, city) {
    let endpoint = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    $.ajax({
        url: endpoint,
        method: "GET"
    })
        .then(function (response) {
            console.log('One Call API Response: ', response);
            uviEl.text(response.current.uvi)
            let uvIndex = response.current.uvi
            console.log(uvIndex)
            // let uvIndex = response.current.uvi;
            if (!searchHistory.includes(city)) {
                searchHistory.push(city);
                localStorage.setItem("history", JSON.stringify(searchHistory));
                renderHistory(false, city);
            }

            // uv index color
            if (uvIndex < 3) {
                uviEl.addClass("favorable");
            } else if (uvIndex >= 3 && uvIndex < 6) {
                uviEl.addClass("moderate");
            } else if (uvIndex > 6) {
                uviEl.addClass("severe");
            }

            // creating 5 days forecast, append to dashboard
            for (let i = 0; i < 5; i++) {
                // let pEl = $("<p>");
                // pEl.text('something');
                // fiveDayForecast.append(pEl);//append function for daily forecast

                function createWeatherCard(obj) {
                    // will create all of the html for the weather card
                    // create the card div
                    let forecastCardEl = $('<div>').addClass('forecast-card card');
                    $("#five-day-forecast").append(forecastCardEl);
                    // created the card header
                    let dateDisplay = moment.unix(response.daily[i].dt).format(' MM/DD/YYYY');//capital 24 hour
                    let forecastDateDisplay = $('<p>').text(dateDisplay).css({ "font-weight": "bold" });
                    forecastCardEl.append(forecastDateDisplay);
                    // create the card data
                    let tempDisplay = response.daily[i].temp.day + ' °F';
                    let forecastTemDisplay = $('<p>').text(tempDisplay);
                    let windDisplay = response.daily[i].wind_speed + ' MPH';
                    let forecastWindDisplay = $('<p>').text(windDisplay);
                    let humidityDisplay = response.daily[i].humidity + ' %';
                    let forecastHumidityDisplay = $('<p>').text(humidityDisplay);
                    // append the header and data to card div
                    forecastCardEl.append(forecastTemDisplay, forecastWindDisplay, forecastHumidityDisplay);
                    // then append div to 5 day-forecast section



                    console.log(dateDisplay);
                    console.log(tempDisplay);
                    console.log(windDisplay);
                    console.log(humidityDisplay);

                }

                createWeatherCard(response.daily[i]);
            };

        }
        )
};



$(document).on('click', '.search', function (e) {
    console.log(e.target.textContent);
    let cityValue = e.target.textContent;
    searchCityCurrentWeather(cityValue);

    //add function to clear 5day history
}
);