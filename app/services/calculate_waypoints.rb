class CalculateWaypoints

  def self.call(origin_latitude, origin_longitude, destination_latitude, destination_longitude, departure, speed, interval)

    include Math

    earthRadius = 3959.0 #in miles

    def self.waypoint(lat1, lng1, θ, distance, earthRadius)
      lat2 = Math.asin( Math.sin(lat1) * Math.cos(distance/earthRadius) + Math.cos(lat1) * Math.sin(distance/earthRadius) * Math.cos(θ) )
      lng2 = lng1 + Math.atan2( Math.sin(θ) * Math.sin(distance/earthRadius) * Math.cos(lat1), Math.cos(distance/earthRadius) - Math.sin(lat1) * Math.sin(lat2) )
      lng2 = (lng2 + 3 * Math::PI) % (2 * Math::PI) - Math::PI # normalise to -180..+180°
      [lat2, lng2]
    end

    lat1, lng1 = origin_latitude.to_rad, origin_longitude.to_rad
    lat2, lng2 = destination_latitude.to_rad, destination_longitude.to_rad

    distance = earthRadius * Math.acos( Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) )
    θ = Math.atan2( Math.sin(lng2 - lng1) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) )

    waypointCount = distance/speed.to_f/interval.to_f.floor

    waypoints = (0..distance).step(distance/waypointCount).map { |distance| waypoint(lat1, lng1, θ, distance, earthRadius) }

    markers = waypoints.map { |lat, lng| {'latitude' => "#{lat.to_deg}", 'longitude' => "#{lng.to_deg}" } }

    #puts "http://maps.googleapis.com/maps/api/staticmap?size=640x320&sensor=false&markers=#{markers}"

    markers
  end 
end

class Numeric
  def to_rad
    self * Math::PI / 180
  end
  def to_deg
    self * 180 / Math::PI
  end
end
