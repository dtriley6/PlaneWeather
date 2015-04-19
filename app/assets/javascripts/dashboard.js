$(document).on('ready page:load', function() {
    // Initialize Namespace
    var forecastApp = forecastApp || {};

    // Submit Form
    forecastApp.submitFlightForm = function() {
        var origin = document.getElementById('origin').value;
        var destination = document.getElementById('destination').value;

        // Empty out arrays.
        forecastApp.flightPathCoordinates = [];
        forecastApp.markers = [];

        forecastApp.getResolvedLocation(origin);
        forecastApp.getResolvedLocation(destination);
    };

    // Resolve
    forecastApp.getResolvedLocation = function(locationQuery) {
        $.getJSON('resolve/' + locationQuery, function(locationData) {
            forecastApp.flightPathCoordinates.push(
                new google.maps.LatLng(locationData.location[0], locationData.location[1]));

            if (forecastApp.flightPathCoordinates.length === 2) {
                var origin = forecastApp.flightPathCoordinates[0];
                var destination = forecastApp.flightPathCoordinates[1];

                var date = document.getElementById('date').value;
                var time = document.getElementById('time').value;
                var speed = document.getElementById('speed').value;
                var timeInterval = document.getElementById('time_interval').value;
                var formattedDateTime = new Date(date + ' ' + time).getTime() / 1000;

                $.getJSON('forecast/' + origin['k'] + ',' + origin['D'] + '/' +
                    destination['k'] + ',' + destination['D'] + '/' +
                    formattedDateTime + '/' + speed + '/' + timeInterval, function(forecasts) {
                        forecastApp.renderMap(forecasts);
                        forecastApp.setForecasts(forecasts);

                        if ($('.forecast-list > h3').length === 0) {
                          $('.forecast-list').prepend('<h3>Forecasts</h3>')
                        }
                    });
            }
        });
    };

    // Forecast
    forecastApp.setForecasts = function(forecastsObject) {
        $('.forecast-list ul').empty();

        var forecasts = forecastsObject.forecasts;
        for (i = 0; i < forecasts.length; i++) {
            var forecast = forecasts[i];
            $.tmpl('templates/forecast_list_item', {
                    temperature: forecast.temperature,
                    time: forecast.time,
                    summary: forecast.summary,
                    precipType: forecast.precipType,
                    windSpeed: forecast.windSpeed,
                    windBearing: forecast.windBearing,
                    pressure: forecast.pressure
                })
                .appendTo('.forecast-list ul')
                .mouseover(function() {
                    forecastApp.markers[$(this).index()].setAnimation(google.maps.Animation.BOUNCE);
                })
                .mouseout(function() {
                    forecastApp.markers[$(this).index()].setAnimation(null);
                });
        }
    };

    // Map
    forecastApp.renderMap = function(opt_markers) {
        var mapOptions = {
            center: {
                lat: 35.877639,
                lng: -78.787472
            },
            zoom: 4
        };

        var map =
            new google.maps.Map(
                document.getElementById('map-canvas'), mapOptions);

        if (forecastApp.flightPathCoordinates) {
            var flightPath = new google.maps.Polyline({
                path: forecastApp.flightPathCoordinates,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });

            flightPath.setMap(map);

            if (opt_markers) {
                var bounds = new google.maps.LatLngBounds();
                var infowindow = new google.maps.InfoWindow();

                var forecasts = opt_markers.forecasts;

                for (i = 0; i < forecasts.length; i++) {
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(forecasts[i]['latitude'], forecasts[i]['longitude']),
                        map: map
                    });
                    forecastApp.markers.push(marker);

                    bounds.extend(marker.position);
                }
                map.fitBounds(bounds);
            }
        }
    };

    forecastApp.renderMap();

    $('.flight-details').submit(function(event) {
        event.preventDefault();
        forecastApp.submitFlightForm();
    });
});
