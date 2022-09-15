//initial DOM variables
let searchBtnEl = $('#search-btn');
let locationInputEl = $("#search-city");
let displayInfoEl = $("#tools-needed");
let shouldBringEl = $('#should-bring');
let whyBringEl = $('#why-bring');

var timeOutside = $("#time-outside")
console.log(timeOutside.val());
// var instance = M.Modal.getInstance(elem);
// request user location
requestLocation();

function generateModal() {
    // opens modal
    $(document).ready(function () {
        $('.modal').modal();
    });

    // multiple selection for form
    $(document).ready(function () {
        $('select').formSelect();
    });

    // grab the #time-outside element
    let timeOutside = $('#time-outside');

    // for 6 through 22
    for(let i = 6; i <= 22; i++) {
        // start with blank text
        let text = '';
        // if the integer is below 13
        if(i < 13) {
            // it's an AM hour
            text = `${i} AM`;
        // otherwise
        } else {
            // it's a PM hour, subtract 12
            text = `${i - 12} PM`;
        }
        // append a new option
        let newOption = $('<option>').attr('value', (i - 5).toString()).text(text);
        // newOption.on('click', () => console.log('test'))
        timeOutside.append(newOption);
    }

    $('#modal-submit').on('click', onModalSubmit);
}

function onModalSubmit() {
    localStorage.setItem("hours-outside", JSON.stringify(timeOutside.val()))
    location.reload();
}

//click event for submiting a searched city
searchBtnEl.click(function (event) {
    event.preventDefault();
    // storing the user input in searchCity variable
    let searchCity = locationInputEl.val();
    //changing the href to include a query variables
    location.search = `q=${searchCity}`;
});

function displayPleaseWait() {
    shouldBringEl.text('Give us a moment...');
    whyBringEl.text('This can take some time...');
}

//function to display the correct info depending on what is saved, or search, etc.
function displayInfo() {
    let params = getQueryParams();
    let coords = loadCoordinates();
    let cityParamExists = (typeof params.q) !== 'undefined';
    // If there are no query parameters, and no local storage info then display default message
    if(!cityParamExists && coords === null) {
        // something to display the message for having no selected location will go here
        console.log('Default message');
        return;
    }

    // tell the user we are doing some heavy calculations
    displayPleaseWait();

    // start time is current time
    let start = dayjs().minute(0).second(0).millisecond(0);
    // end time is 10 hours after that, this might be different depending on user preferences but by default it will be this
    let end = start.clone().add(10, 'hour');

    let excludedHours = []; // TODO implement excluded hours

    // if there are no query parameters, but there is local storage info then display info based on local storage info
    if(!cityParamExists && coords != null) {
        fetchReverseLatLon(coords.lat, coords.lon).then((data) => {
            // let fetchParameters = {lat: data.lat, lon: data.lon};
            return fetchForecast(data);
        }).then((data) => {
            displayInfoAfterRequest(data, start, end);
            // whyBringEl.text(data.forecast[0].description);
            // this will be a function for what we are displaying in the front page 
            // console.log(data.forecast[0]);
        }).catch(catchErrors);

    // Else if there are query parameters then display info based off of query parameters
    } else if(cityParamExists) {
        let cityName = params.q;
        fetchLatLon(cityName).then((data) => {
            // let fetchParameters = {lat: data.lat, lon: data.lon};
            // let savedCoords = {fetchParameters};
            return fetchForecast(data);
        }).then((data) => {
            displayInfoAfterRequest(data, start, end);
            // whyBringEl.text(data.forecast[0].description);
            // this will be a function for what we are displaying in the front page 
            // console.log(data.forecast[0]);
        }).catch(catchErrors);
    };
}

function displayInfoAfterRequest(data, from, to, excludedHours) {
    // trim the data set for what we need
    trimDataSet(data, from, to, excludedHours);
    // get the tools per each hour
    getToolsPerHour(data);
    // then we get the tools we need over the range of time we're looking at, finally...
    let toolsNeeded = [];
    // for each hour
    for(let i = 0; i < data.forecast.length; i++) {
        let hourForecast = data.forecast[i];
        // for each tool
        hourForecast.tools.forEach(tool => {
            // if it's not already accounted for
            if(!toolsNeeded.includes(tool)) {
                // push it to the array
                toolsNeeded.push(tool);
            }
        });
    }
    // TODO display the tools needed as text on the page
}

// function for catching promise errors, will display that something went wrong and to try later
function catchErrors() {
    shouldBringEl.text('Oops, that wasn\'t supposed to happen?');
    whyBringEl.text('An unexpected error occurred, maybe try again later?')
}

// generate modal stuff
generateModal()
// if we are not on index.html homepage, dont run this function
displayInfo();
