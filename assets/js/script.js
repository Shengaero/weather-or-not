//initial DOM variables
let searchBtn = $('#search-btn');
let locationInput = $("#search-city");
let displayInfo = $("#tools-needed");

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
