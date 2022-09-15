//initial DOM variables
let searchBtnEl = $('#search-btn');
let locationInputEl = $("#search-city");
let displayInfoEl = $("#tools-needed");
let whyBringEl = $('#why-bring');

// request user location
requestLocation();
// opens modal
$(document).ready(function () {
    $('.modal').modal();
});
// multiple selection for form
$(document).ready(function () {
    $('select').formSelect();
});

//click event for submiting a searched city
searchBtnEl.click(function (event) {
    event.preventDefault();
    // storing the user input in searchCity variable
    let searchCity = locationInputEl.val();
    //changing the href to include a query variables
    location.search = `q=${searchCity}`;
});

//function to display the correct info depending on what is saved, or search, etc.
function displayInfo() {
    let params = getQueryParams();
    let coords = loadCoordinates();
    let cityParamExists = (typeof params.q) !== 'undefined';
    // If there are no query parameters, and no local storage info then display default message
    if(!cityParamExists && coords === null) {
        // something to display the message for having no selected location will go here
        console.log('Default message');

    // Else if there are no query parameters, but there is local storage info then display info based on local storage info
    } else if(!cityParamExists && coords != null) {
        fetchReverseLatLon(coords.lat, coords.lon).then((data) => {
            let fetchParameters = {lat: data.lat, lon: data.lon};
            return fetchForecast(fetchParameters);
        }).then((data) => {
            whyBringEl.text(data.forecast[0].description);
            // this will be a function for what we are displaying in the front page 
            console.log(data.forecast[0]);
        }
        );

    // Else if there are query parameters then display info based off of query parameters
    } else if(cityParamExists) {
        let cityName = params.q;
        fetchLatLon(cityName).then((data) => {
            let fetchParameters = {lat: data.lat, lon: data.lon};
            let savedCoords = {fetchParameters};
            return fetchForecast(savedCoords);
        }).then((data) => {
            whyBringEl.text(data.forecast[0].description);
            // this will be a function for what we are displaying in the front page 
            console.log(data.forecast[0]);
        }
        );
    };
}

// if we are not on index.html homepage, dont run this function
displayInfo();
