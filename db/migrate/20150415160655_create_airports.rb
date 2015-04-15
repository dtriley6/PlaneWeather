class CreateAirports < ActiveRecord::Migration
  def change
    create_table :airports do |t|
      t.string :iata
      t.string :latitude
      t.string :longitude

      t.timestamps null: false
    end
  end
end
