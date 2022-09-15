let coordsLocalStorageKey = 'preferred-coordinates';
let allowedQueryParameters = ['q'];

let tools = [
    {
        name: 'umbrella',
        isFor: 'rain',
        condition: function (forecast) {
            let desc = forecast.description.toLowerCase();
            // if the description includes "showers" or "rain", return true, else false
            return desc.includes('showers') || desc.includes('rain');
        }
    },
    {
        name: 'raincoat',
        isFor: 'rain',
        condition: function (forecast) {
            let desc = forecast.description.toLowerCase();
            // if description doesn't even hint at rain, return false
            if(!desc.includes('showers') && !desc.includes('rain')) {
                return false;
            }
            // if description doesn't include the word "likely", or
            // says there will only be a "slight chance", return false
            if(!desc.includes('likely') || desc.includes('slight chance')) {
                return false;
            }
            // return true
            return true;
        }
    },
    {
        name: 'winter coat',
        isFor: 'cold',
        condition: function (forecast) {
            let temp = forecast.temp;
            return temp < 45;
        }
    }
];

function trimDataSet(data, from, to, excludedHours) {
    // grab the first hour that we care about
    let startIndex = 0;
    for(; startIndex < data.forecast.length; startIndex++) {
        let hourForecast = data.forecast[startIndex];
        if(hourForecast.time.isAfter(from)) {
            break;
        }
    }

    // get the last hour that we care about
    let endIndex = startIndex;
    for(; endIndex < data.forecast.length; endIndex++) {
        let hourForecast = data.forecast[endIndex];
        if(hourForecast.time.isAfter(to)) {
            break;
        }
    }

    // set forecast to the slice between the first and last hours we care about
    data.forecast = data.forecast.slice(startIndex, endIndex)

    // TODO implement excluded hours
}

// modifies the provided data to include tools via data.forecast[i].tools
function getToolsPerHour(data) {
    for(let i = 0; i < data.forecast.length; i++) {
        let hourForecast = data.forecast[i];
        hourForecast.tools = [];
        for(let j = 0; j < tools.length; j++) {
            let tool = tools[j];
            if(tool.condition(hourForecast)) {
                hourForecast.tools.push(tool);
            }
        }
    }
}

// shortcut for fetch requests
function responseToJSON(response) {
    return response.json();
}

function requestLocation() {
    // we already have stored coordinates, just return
    if(loadCoordinates()) {
        return;
    }
    // have the navigator request the user's location
    navigator.geolocation.getCurrentPosition((position) => {
        // first store coordinates
        storeCoordinates({lat: position.coords.latitude, lon: position.coords.longitude});
        // then reload page
        location.reload();
    });
}

function isAllowedQueryParam(string) {
    for(let i = 0; i < allowedQueryParameters.length; i++) {
        if(allowedQueryParameters[i] === string) {
            return true;
        }
    }
    return false;
}

function sanitizeQueryParamValue(string) {
    // replace '%20' with a space
    string = string.replace('%20', ' ');
    // return the sanitized string
    return string;
}

function getQueryParams() {
    // start with an empty JS Object
    let params = {};
    // and the search string part of the URL
    let searchString = location.search;
    // if the search string is empty
    if(searchString.length === 0) {
        // return the empty JS object
        return params;
    }
    // if the first character is '?'
    if(searchString.charAt(0) === '?') {
        // remove that '?'
        searchString = searchString.substring(1, searchString.length);
    }
    // split the string into parts
    let searchParts = searchString.split('&');
    // for each element in the searchParts array
    for(let i = 0; i < searchParts.length; i++) {
        let searchPart = searchParts[i];
        // split it into two parts around an equals sign
        let paramParts = searchPart.split('=', 2);
        // if there are 2 parts and the first is an allowed query parameter
        if(paramParts.length == 2 && isAllowedQueryParam(paramParts[0])) {
            // set the first part as a property in the JS Object, with it's value being the second part
            params[paramParts[0]] = sanitizeQueryParamValue(paramParts[1]); // make sure to sanitize it
        }
    }
    // return the JS Object
    return params;
}

// accepts a JS Object with lat and lon properties
// if undefined is passed, this will remove the value
function storeCoordinates(coords) {
    if(coords === null) {
        localStorage.removeItem(coordsLocalStorageKey);
        return;
    }
    console.log(coords)
    localStorage.setItem(coordsLocalStorageKey, JSON.stringify(coords));
}

// loads the coordinates if they exist, otherwise returns undefined
function loadCoordinates() {
    let coords = null;
    let coordsString = localStorage.getItem(coordsLocalStorageKey);
    if(coordsString !== null) {
        coords = {};
        JSON.parse(coordsString, (k, v) => {
            if(k === '') {
                return;
            }
            coords[k] = v;
        });
    }
    return coords;
}
