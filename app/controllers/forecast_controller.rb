class ForecastController < ApplicationController

  def calculate
    origin = params[:origin]
    destination = params[:destination]
    departure = params[:departure]
    speed = params[:speed]
    interval = params[:interval]

    origin_split = origin.split(',')
    destination_split = destination.split(',')

    origin_latitude, origin_longitude = origin_split[0].to_f, origin_split[1].to_f
    destination_latitude, destination_longitude = destination_split[0].to_f, destination_split[1].to_f

    waypoints = CalculateWaypoints.call(origin_latitude, origin_longitude, destination_latitude, destination_longitude, departure, speed, interval)

    hydra = Typhoeus::Hydra.hydra

    @forecasts = {:forecasts => []}
    count = 0;
    requests = waypoints.count.times.map {
      url = "https://api.forecast.io/forecast/#{ ENV["FORECAST_IO_KEY"] }/" +
            waypoints[count]["latitude"] + "," + waypoints[count]["longitude"] + "," + (departure.to_i + (count * interval.to_i * 3600)).to_s
      count += 1

      request = Typhoeus::Request.new(url)
      hydra.queue(request)
      request
    }
    hydra.run

    responses = requests.map { |request|
      JSON.parse(request.response.body)
    }

    responses.each do |forecast|
      @forecast = { :latitude => forecast["latitude"], :longitude => forecast["longitude"], :temperature => forecast["currently"]["temperature"],
        :time => forecast["currently"]["time"], :summary => forecast["currently"]["summary"], :precipType => forecast["currently"]["precipType"],
        :windSpeed => forecast["currently"]["windSpeed"], :windBearing => forecast["currently"]["windBearing"], :pressure => forecast["currently"]["pressure"]}
      @forecasts[:forecasts] << @forecast
    end


    respond_to do |format|
      format.json { render json: @forecasts }
    end
  end

end

