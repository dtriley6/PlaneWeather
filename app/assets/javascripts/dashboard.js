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

    // Empty out array.
    forecastApp.flightPathCoordinates = [];

    forecastApp.getResolvedLocation(origin)
    forecastApp.getResolvedLocation(destination)
  };

  // Resolve
  forecastApp.getResolvedLocation = function(locationQuery) {
    $.getJSON('resolve/' + locationQuery, function(data) {
      forecastApp.flightPathCoordinates.push(new google.maps.LatLng(data.location[0], data.location[1]));

      if(forecastApp.flightPathCoordinates.length === 2) {
        initializeMap();
      }
    });
  };

  // Forecast
  forecastApp.getForecastsForFlight = function() {

  };

  // Map
  var initializeMap = function() {
    var mapOptions = {
      center: { lat: 35.877639, lng: -78.787472}, zoom: 4
    };
    var map = forecastApp.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    if(forecastApp.flightPathCoordinates) {
      var flightPath = new google.maps.Polyline({
        path: forecastApp.flightPathCoordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });

      flightPath.setMap(map);
    }

  };

  initializeMap();

  $('.submit-flight').click(forecastApp.submitFlightForm);
});
