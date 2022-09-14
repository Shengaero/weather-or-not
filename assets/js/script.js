//initial DOM variables
let searchBtn = $('#search-btn');
let locationInput = $("#search-city");
let displayInfo = $("#tools-needed");

//click event for submiting a searched city
searchBtn.click(function (event) {
    event.preventDefault();
    // storing the user input in searchCity variable
    let searchCity = locationInput.val();
    //changing the href to include a query variables
    location.search = `q=${searchCity}`;
});
