# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

#json = ActiveSupport::JSON.decode(File.read('db/seeds/airports.json'))
 
#json.each do |a|
  #Airport.create!(a['country'], without_protection: true)
#end

Airport.delete_all

airportsPath = "#{Rails.root}/db/seeds/airports.json"
airports = JSON.parse(File.read(airportsPath))

airports.each do |airport|
  Airport.create!(iata: airport[1]["iata"], latitude: airport[1]["latitude"], longitude: airport[1]["longitude"])
end
