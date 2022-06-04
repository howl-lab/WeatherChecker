// search button
let searchBtn = $('#searchBtn');
let cityEl = $('#city-value');
// 5 day forecast
let searchHistory = JSON.parse(localStorage.getItem('history')) || [];
console.log(searchHistory);

// my api key
let apiKey = "d47e097f5d363d7b0b0a962b12e789dc";


// event listener button to capture user input to local storage
searchBtn.on('click', function (event) {
    event.preventDefault();
    let userInput = $("#userInput").val().toLowerCase();
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

// on page load, check for existing city searches
//add those as button to page
// if the input is a new city, add to page
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
    // d47e097f5d363d7b0b0a962b12e789dc
    const endpoint = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial";
    fetch(endpoint)
        .then(function (turnToJson) {
            return turnToJson.json();
        })
        .then(function (response) {
            console.log(response);
            cityEl.text(response.name)
            searchOneCallAPI(response.coord.lat, response.coord.lon, city)
            // let h4El = $("<h4>");
            // h4El.text(response.name);
            // currentWeather.append(h3El);
        });
};

function searchOneCallAPI(lat, lon, cityPassThrough) {
    let endpoint = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    $.ajax({
        url: endpoint,
        method: "GET"
    })
        .then(function (response) {
            console.log('One Call API Response: ', response);

            if (!searchHistory.includes(cityPassThrough)) {
                searchHistory.push(cityPassThrough);
                localStorage.setItem("history", JSON.stringify(searchHistory));
                renderHistory(false, cityPassThrough);
            }
        });
};

$(document).on('click', '.search', function (e) {
    console.log(e.target.textContent);
    let cityValue = e.target.textContent;

    searchCityCurrentWeather(cityValue);
});

// new function to do: create button from local storage
//on load check local storage for city name as an array. then create buttons from them. make their onclick event button to make api call then display

// let cities = getSavedCities();

// function getSavedCities() {
//     let cities = JSON.parse(localStorage.getItem('cities'));
//     if (cities) {
//         return cities;
//     } else {
//         return [];
//     }
// };


// function searchHistory() {
//     for (var i = 0; i < cities.length; i++) {
//         // appending value of cities as a list to #searchHistory

//         $("li").text(function (i) {
//             return cities[i];
//         });

//         $('li').append('cities');
//     }
// };

// // get lon and lat of a city name
// let lastCity = cities[cities.length - 1];
// let geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${lastCity},US&appid=4bcac4085f133666bc3803dc7ed2e35c
// `;

// fetch(geoUrl)
//     .then(response => response.json())
//     .then(data => getWeather(data[0].lon, data[0].lat));

// //get weather based on city name search
// function getWeather(lat, lon) {

//     let weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=4bcac4085f133666bc3803dc7ed2e35c
//     `;

//     fetch(weatherUrl)
//         .then(function (response) {
//             console.log(response)
//             return response.json();
//         })
//         .then(function (data) {
//             console.log(data);
//         })
// }


// city name
// date
// icon representing weather condition
// temperature
//humidity
//wind speed
//uv index (with color indicating conditions: favorable, moderate, severe)