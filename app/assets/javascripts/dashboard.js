$(document).on('ready page:load', function() {
  var forecastApp = forecastApp || {}


  forecastApp.submitFlightForm = function() {
    var origin = document.getElementById('origin').value;
    var destination = document.getElementById('destination').value;
    var date = document.getElementById('date').value;
    var time = document.getElementById('time').value;
    var speed = document.getElementById('speed').value;
    var timeInterval = document.getElementById('time_interval').value;

    console.log(origin, destination, date, time, speed, timeInterval);

    forecastApp.getResolvedLocation(origin)
    forecastApp.getResolvedLocation(destination)
  };


  // Resolve
  forecastApp.getResolvedLocation = function(locationQuery) {
    $.getJSON('resolve/' + locationQuery, function(data) {
      console.log(data);
    });
  };

  // Forecast
  forecastApp.getForecastsForFlight = function() {

  };

  // Map
  var initializeMap = function() {
    var mapOptions = {
      center: { lat: -34.397, lng: 150.644}, zoom: 8
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  };

  initialize();

  $('.submit-flight').click(forecastApp.submitFlightForm);
});
