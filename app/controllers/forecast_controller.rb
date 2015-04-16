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

    #puts origin_latitude, origin_longitude, destination_latitude, destination_longitude

    @waypoints = CalculateWaypoints.call(origin_latitude, origin_longitude, destination_latitude, destination_longitude, departure, speed, interval)

    respond_to do |format|
      format.json { render json: @waypoints }
    end
  end

end

