let coordsLocalStorageKey = 'preferred-coordinates';
let allowedQueryParameters = ['q']

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
