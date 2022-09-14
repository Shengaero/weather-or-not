let nwsBaseURL = 'https://api.weather.gov/';
let forecastRoute = 'points/';

// formats lat and lon into full forecast API URL
let forecastURL = (lat, lon) => `${nwsBaseURL}${forecastRoute}${lat},${lon}`;

function fetchForecast(geoInfo) {
    // fetch based on the formatted forecast API URL and return the promise
    return fetch(forecastURL(geoInfo.lat, geoInfo.lon)).then(responseToJSON)
        .then((json) => {
            // using the forecastHourly URL in the response
            // we make another request for that data
            return fetch(json.properties.forecastHourly).then(responseToJSON);
        })
        .then((json) => {
            // make an array to populate with the wrapped API data for hourly forecast
            let forecast = [];
            // for each hour period in the json
            for(let i = 0; i < json.properties.periods.length; i++) {
                let dayForecast = json.properties.periods[i];
                // wrap the necessary information and push it to the forecast array
                forecast.push({
                    description: dayForecast.shortForecast,
                    time: dayjs(dayForecast.startTime),
                    temp: dayForecast.temperature
                });
            }
            // wrap geographic information with forecast information
            let payload = {
                geoInfo: geoInfo,
                forecast: forecast
            };
            // return the payload
            return payload;
        });
}
