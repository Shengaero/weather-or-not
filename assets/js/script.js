//initial DOM variables
let searchBtn = $('#search-btn');
let locationInput = $("#search-city");
let displayInfo = $("#tools-needed");

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

// instance.onCloseEnd({
//     reset()
// })
$('#modal-submit').on('click', onModalSubmit);
