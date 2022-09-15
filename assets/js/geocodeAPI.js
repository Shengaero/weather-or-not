let apiBase = 'https://nominatim.openstreetmap.org/';
let searchRoute = 'search'
let reverseRoute = 'reverse'

function fetchLatLon(cityName) {
    let requestURL = `${apiBase}${searchRoute}?city=${cityName}&format=json`;

    return fetch(requestURL)
        .then(responseToJSON)
        .then(function (data) {
            // defer this to the reverse fetch, the info we get from it is much easier to work with
            return fetchReverseLatLon(data[0].lat, data[0].lon).then((json) => json);

            // output from open street map for name gives "city(0), county(1), state(2), country(3)" so I split on commas to separate locations
            // let splitArray = data[0].display_name.split(',');
            // let geocodedArray = {
            //     city: splitArray[0],
            //     displayName: data[0].display_name,
            //     // state: splitArray[2],
            //     // country: splitArray[3],
            //     lat: data[0].lat,
            //     lon: data[0].lon
            // };
            // return geocodedArray;
        });
}

function fetchReverseLatLon(lat, lon) {
    let requestURL = `${apiBase}${reverseRoute}?lat=${lat}&lon=${lon}&format=json`;

    return fetch(requestURL)
        .then(responseToJSON)
        .then((json) => {
            // location information will contain city, state, and country
            let locationInfo = {
                city: undefined,
                state: undefined,
                country: undefined
            }

            // the address property that's delivered from the request will contain the info we need
            let address = json.address;

            // if there's a city property
            if(address.city) {
                // set the location info city property to it
                locationInfo.city = address.city;
            // if there's a village property 
            } else if(address.village) {
                // set the location info city property to it
                locationInfo.city = address.village;
            }

            // if there's a state property
            if(address.state) {
                // set the location info state property to it
                locationInfo.state = address.state;
            }

            // if there's a country property
            if(address.country) {
                // set the location info country property to it
                locationInfo.country = address.country;
            }

            // return the packaged info
            return {
                locationInfo: locationInfo,
                lat: lat,
                lon: lon
            };
        })
}

// commenting out check on data
// cityToLatLon('Chicago').then(function (data) {
//     console.log(data.lat);
//     console.log(data.lon);
// });
