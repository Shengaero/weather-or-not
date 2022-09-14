let coordsLocalStorageKey = 'preferred-coordinates';

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
        storeCoordinates({lat: position.coords.latitude, lon: position.coords.longitude});
    });
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
