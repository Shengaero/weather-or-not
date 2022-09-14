//initial DOM variables
let searchBtnEl = $('#search-btn');
let locationInputEl = $("#search-city");
let displayInfoEl = $("#tools-needed");

// request user location
requestLocation();

$(document).ready(function () {
    $('.modal').modal();
});

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
    let coords = loadCoordinates();
    //IF there are no query parameters, and no local storage info THEN display default message
    if(location.search === '' && !coords) {
        console.log('Default message');
    //ELSE IF there are no query parameters, but there is local storage info THEN display info based on local storage info
    } else if(location.search === '' && coords != null) {
        console.log('Display info based on local storage');
    //ELSE IF there are query parameters THEN display info based off of query parameters
    } else if(location.search != '') {
        console.log('Display info based off query parameters');
    };
}

// if we are not on index.html homepage, dont run this function
displayInfo();
