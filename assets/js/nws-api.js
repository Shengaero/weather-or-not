let nwsBaseURL = 'https://api.weather.gov';
let forecastRoute = 'points/';

// formats lat and lon into full forecast API URL
let forecastURL = (lat, lon) => `${nwsBaseURL}${forecastRoute}${lat},${lon}`;

function fetchForecast(lat, lon) {
    let url = forecastURL(lat, lon);
    fetch(url).then((response) => {})
}
