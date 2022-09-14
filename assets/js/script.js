//initial DOM variables
let searchBtn = $('#search-btn');
let locationInput = $("#search-city");
let displayInfo = $("#tools-needed");

// request user location
requestLocation();

$(document).ready(function () {
    $('.modal').modal();
});

$(document).ready(function () {
    $('select').formSelect();
});
