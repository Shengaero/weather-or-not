//initial DOM variables
let searchBtnEl = $('#search-btn');
let locationInputEl = $("#search-city");
let displayInfoEl = $("#tools-needed");
let shouldBringEl = $('#should-bring');
let whyBringEl = $('#why-bring');

let advancedSearchCity = $('#advanced-search-city');
let daysOutside = $('#days-outside');
let timeOutside = $('#time-outside');
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
    // let timeOutside = $('#time-outside');

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
        let newOption = $('<option>').attr('value', (i).toString()).text(text);
        // newOption.on('click', () => console.log('test'))
        timeOutside.append(newOption);
    }

    $('#modal-submit').on('click', onModalSubmit);
}

function onModalSubmit() {
    // should we save settings?
    let saveSettings = $('#save-settings')[0].checked;
    let advancedSearchCityValue = advancedSearchCity.val();
    let daysOutsideValue = daysOutside.val();
    let timeOutsideValue = timeOutside.val();

    if(saveSettings) {
        storeAdvancedSearch(advancedSearchCityValue, daysOutsideValue, timeOutsideValue);
        location.search = ''; // clear search
        return;
    }
    let searchString = `q=${advancedSearchCityValue}`;
    if(daysOutsideValue != null) {
        searchString += `&days=${daysOutsideValue}`;
    }
    if(timeOutsideValue != null) {
        searchString += `&hours=${timeOutsideValue.join(',')}`;
    }
    location.search = searchString;
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
function displaySearchInfo() {
    let params = getQueryParams();
    let coords = loadCoordinates();
    let advancedSearch = loadAdvancedSearch();
    let cityParamExists = (typeof params.q) !== 'undefined';
    // If there are no query parameters, and no local storage info then display default message
    if(!cityParamExists && coords === null && advancedSearch == null) {
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

    // works
    let includedHours = [];
    if((typeof params.hours) !== 'undefined') {
        includedHours = params.hours.split(',');
    } else if(advancedSearch !== null && !cityParamExists) {
        if(advancedSearch.hours) {
            includedHours = advancedSearch.hours;
        }
    }

    // works
    if(includedHours.length > 0) {
        console.log(includedHours[0])
        start = start.hour(parseInt(includedHours[0]));
        end = end.hour(parseInt(includedHours[includedHours.length - 1]));
    }

    // works
    let days = 0;
    if((typeof params.days) !== 'undefined') {
        days = params.days;
    } else if(advancedSearch !== null && !cityParamExists) {
        if(advancedSearch.days) {
            days = advancedSearch.days;
        }
    }

    // if there are no query parameters, but there is local storage info then display info based on local storage info
    if(!cityParamExists && coords != null) {
        fetchReverseLatLon(coords.lat, coords.lon).then((data) => {
            // let fetchParameters = {lat: data.lat, lon: data.lon};
            return fetchForecast(data);
        }).then((data) => {
            displaySearchInfoAfterRequest(data, start, end, includedHours, days);
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
            displaySearchInfoAfterRequest(data, start, end, includedHours, days);
            // whyBringEl.text(data.forecast[0].description);
            // this will be a function for what we are displaying in the front page 
            // console.log(data.forecast[0]);
        }).catch(catchErrors);
    };
}

function displaySearchInfoAfterRequest(data, from, to, includedHours, days) {
    // trim the data set for what we need
    trimDataSet(data, from, to, includedHours, days);
    // get the tools per each hour
    getToolsPerHour(data);
    // then we get the tools we need over the range of time we're looking at, finally...
    let toolsNeeded = [];
    // for each hour
    for(let hourForecast of data.forecast) {
        // for each tool
        for(let tool of hourForecast.tools) {
            // if it's not already accounted for
            if(!toolsNeeded.includes(tool)) {
                // push it to the array
                toolsNeeded.push(tool);
            }
        }
    }

    if(toolsNeeded.length === 0) {
        shouldBringEl.text("You're good to go!");
        whyBringEl.text('The weather is looking fine for now!')
    } else {
        let shouldBringToolsString = '';
        for(let i in toolsNeeded) {
            let last = toolsNeeded.length - 1 === i;
            if(last && toolsNeeded.length > 1) {
                shouldBringToolsString += 'and '
            }
            shouldBringToolsString += toolsNeeded[i].displayName;
            if(!last && toolsNeeded.length > 1) {
                shouldBringToolsString += ', ';
            }
        }
        shouldBringEl.text(`You should bring ${shouldBringToolsString}`);
        let typesOfWeather = [];
        data.forecast.forEach((hourForecast) => {
            if(hourForecast.tools.length < 1) {
                return;
            }
            if(!typesOfWeather.includes(hourForecast.description)) {
                typesOfWeather.push(hourForecast.description);
            }
        })
        whyBringEl.text(typesOfWeather.join(', '))
    }
}

// function for catching promise errors, will display that something went wrong and to try later
function catchErrors(error) {
    shouldBringEl.text('Oops, that wasn\'t supposed to happen?');
    whyBringEl.text('An unexpected error occurred, maybe try again later?')
    console.log(error)
}

// generate modal stuff
generateModal()
// if we are not on index.html homepage, dont run this function
displaySearchInfo();
