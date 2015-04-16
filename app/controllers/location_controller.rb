class LocationController < ApplicationController

  def resolve
    @locationQuery = params[:location]
    if is_airport_code?(@locationQuery.upcase)
      @airport = Airport.find_by_iata(@locationQuery.upcase);
      @location = { "location" => [@airport.latitude, @airport.longitude] }
    else
      @split_location = @locationQuery.split(',')
      #@location = { "location" => ['%.1f' % @split_location[0].to_f, '%.1f' % @split_location[1].to_f]}
      @location = { "location" => [@split_location[0].to_f, @split_location[1].to_f]}
    end
    respond_to do |format|
      format.json { render json: @location }
    end
  end

  private
    def is_airport_code?(location)
      airport_code_regex = /[A-Z]{3}/i
      location.present? && (location =~ airport_code_regex)
    end
end


