//initial DOM variables
let searchBtnEl = $('#search-btn');
let locationInputEl = $("#search-city");
let displayInfoEl = $("#tools-needed");

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
    console.log(params);
    console.log(params.city);
    let cityParamExists = (typeof params.city) === 'undefined';
    //IF there are no query parameters, and no local storage info THEN display default message
    if(!cityParamExists && !coords) {
        console.log('Default message');

        //ELSE IF there are no query parameters, but there is local storage info THEN display info based on local storage info
    } else if(!cityParamExists && coords != null) {
        console.log('Display info based on local storage');
        fetchForecast(coords).then(
            console.log(coords)
        );

        //ELSE IF there are query parameters THEN display info based off of query parameters
    } else if(cityParamExists) {
        let cityName = params.city;
        console.log('Display info based off query parameters');
        fetchLatLon(cityName).then(
            console.log(cityName)
        );
    };
}

// if we are not on index.html homepage, dont run this function
displayInfo();



// if we have the coordinates already fetch the weather;
// if we dont have the coordinates we are going to get coordinates then fetch the weather
