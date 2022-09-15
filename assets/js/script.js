//initial DOM variables
let searchBtn = $('#search-btn');
let locationInput = $("#search-city");
let displayInfo = $("#tools-needed");

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
        timeOutside.append($('<option>').attr('value', (i - 5).toString()).text(text));
    }
}

generateModal()
