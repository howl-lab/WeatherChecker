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
    // localStorage.setItem('cities', JSONß.stringify(cities));
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
        for (let i = 0; i < searchHistory.length; i++) {
            let liEl = $("<li>");
            let searchBtn = $("<button>");
            searchBtn.text(capitalizeWords(searchHistory[i]));
            searchBtn.addClass('search');
            liEl.append(searchBtn);
            searchHistoryEl.append(liEl);
        };
    } else {
        let liEl = $("<li>");
        let searchBtn = $("<button>");
        searchBtn.text(capitalizeWords(newCity));
        searchBtn.addClass('search');
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
            let uvIndex = uviEl.text(response.current.uvi)
            // let uvIndex = response.current.uvi;
            if (!searchHistory.includes(city)) {
                searchHistory.push(city);
                localStorage.setItem("history", JSON.stringify(searchHistory));
                renderHistory(false, city);
            }
            // uv index color
            // if (uvIndex < 3) {
            //     uviEl.addClass("favorable");
            // } else if (uviIndex >= 3 && uviIndex < 6) {
            //     uviEl.addClass("moderate");
            // } else if (uviIndex > 6) {
            //     uviEl.addClass("severe");
            // }

            // creating 5 days forecast, append to dashboard
            for (let i = 0; i < response.daily.length[4]; i++) {
                let pEl = $("<p>");

            };

        });
};

$(document).on('click', '.search', function (e) {
    console.log(e.target.textContent);
    let cityValue = e.target.textContent;

    searchCityCurrentWeather(cityValue);
});