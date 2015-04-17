$(document).on('ready page:load', function() {
  var forecastApp = forecastApp || {}


  forecastApp.submitFlightForm = function() {
    var origin = document.getElementById('origin').value;
    var destination = document.getElementById('destination').value;

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
        var origin = forecastApp.flightPathCoordinates[0];
        var destination = forecastApp.flightPathCoordinates[1];

        var date = document.getElementById('date').value;
        var time = document.getElementById('time').value;
        var speed = document.getElementById('speed').value;
        var timeInterval = document.getElementById('time_interval').value;
        var formattedDateTime = new Date(date + ' ' + time).getTime() / 1000;

        $.getJSON('forecast/' + origin['k'] + ',' + origin['D'] + '/' +
          destination['k'] + ',' + destination['D'] + '/' +
          formattedDateTime + '/' + speed + '/' + timeInterval , function(forecasts) {
            console.log(forecasts);
            initializeMap(forecasts);
          });
      }
    });
  };

  // Forecast
  forecastApp.getForecastsForFlight = function() {

  };

  // Map
  var initializeMap = function(opt_markers) {
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

      if(opt_markers) {
        //create empty LatLngBounds object
        var bounds = new google.maps.LatLngBounds();
        var infowindow = new google.maps.InfoWindow();

        var forecasts = opt_markers.forecasts;

        for (i = 0; i < forecasts.length; i++) {  
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(forecasts[i]["latitude"], forecasts[i]["longitude"]),
            map: map
          });

          //extend the bounds to include each marker's position
          bounds.extend(marker.position);

        }

        //now fit the map to the newly inclusive bounds
        map.fitBounds(bounds);
      }
    }

  };

  initializeMap();

  $('.submit-flight').click(forecastApp.submitFlightForm);
});
