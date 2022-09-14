let apiBase = 'https://nominatim.openstreetmap.org/search?';

function fetchLatLon(cityName) {
    let requestURL = apiBase + `city=${cityName}&format=json`;

    return fetch(requestURL)
        .then(responseToJSON)
        .then(function (data) {
            // output from open street map for name gives "city(0), county(1), state(2), country(3)" so I split on commas to separate locations
            let splitArray = data[0].display_name.split(',');
            let geocodedArray = {
                city: splitArray[0],
                displayName: data[0].display_name,
                // state: splitArray[2],
                // country: splitArray[3],
                lat: data[0].lat,
                lon: data[0].lon
            };
            return geocodedArray;
        });
}

// commenting out check on data
// cityToLatLon('Chicago').then(function (data) {
//     console.log(data.lat);
//     console.log(data.lon);
// });
