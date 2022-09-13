let nwsBaseURL = 'https://api.weather.gov/';
let forecastRoute = 'points/';

// formats lat and lon into full forecast API URL
let forecastURL = (lat, lon) => `${nwsBaseURL}${forecastRoute}${lat},${lon}`;

function fetchForecast(lat, lon) {
    let url = forecastURL(lat, lon);
    fetch(url).then(responseToJSON)
        .then((json) => {
            console.log(json);
            return fetch(json.properties.forecast).then(responseToJSON);
        })
        .then((json) => {
            console.log(json);
        })
}
