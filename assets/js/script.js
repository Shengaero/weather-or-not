//initial DOM variables
let searchBtnEl = $('#search-btn');
let locationInputEl = $("#search-city");
let displayInfoEl = $("#tools-needed");
let whyBringEl = $('#why-bring');

var timeOutside = $("#time-outside")
console.log(timeOutside.val());
// var instance = M.Modal.getInstance(elem);
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

var makeItRain = function () {
    //clear out everything
    $('.rain').empty();

    var increment = 0;
    var drops = "";
    var backDrops = "";

    while(increment < 100) {
        //couple random numbers to use for various randomizations
        //random number between 98 and 1
        var randoHundo = (Math.floor(Math.random() * (98 - 1 + 1) + 1));
        //random number between 5 and 2
        var randoFiver = (Math.floor(Math.random() * (5 - 2 + 1) + 2));
        //increment
        increment += randoFiver;
        //add in a new raindrop with various randomizations to certain CSS properties
        drops += '<div class="drop" style="left: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div><div class="splat" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div></div>';
        backDrops += '<div class="drop" style="right: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div><div class="splat" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div></div>';
    }

    $('.rain.front-row').append(drops);
    $('.rain.back-row').append(backDrops);
};

$('.splat-toggle.toggle').on('click', function () {
    $('body').toggleClass('splat-toggle');
    $('.splat-toggle.toggle').toggleClass('active');
    makeItRain();
});

$('.back-row-toggle.toggle').on('click', function () {
    $('body').toggleClass('back-row-toggle');
    $('.back-row-toggle.toggle').toggleClass('active');
    makeItRain();
});

$('.single-toggle.toggle').on('click', function () {
    $('body').toggleClass('single-toggle');
    $('.single-toggle.toggle').toggleClass('active');
    makeItRain();
});

makeItRain();
// instance.onCloseEnd({
//     reset()
// })
$('#modal-submit').on('click', onModalSubmit);

function onModalSubmit() {
    // alert('working!')
    console.log(timeOutside.val());

    localStorage.setItem("hours-outside", JSON.stringify(timeOutside.val()))

    location.reload();
    
   


    // timeOutside.empty();
 
}


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
