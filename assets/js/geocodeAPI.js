let apiBase = 'https://nominatim.openstreetmap.org/search?';

function cityToLatLon(cityName) {
    let requestURL = apiBase + `city=${cityName}&format=json`;

    return fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data[0].display_name);
            let geocodedArray = {
                city: data[0].display_name.split(',')[0],
                state: data[0].display_name.split(',')[2],
                country: data[0].display_name.split(',')[3],
                lat: data[0].lat,
                lon: data[0].lon
            };
            console.log(geocodedArray);
            return geocodedArray;
        });
}

cityToLatLon('Chicago').then(function (data) {
    console.log(data.lat);
    console.log(data.lon);
});
