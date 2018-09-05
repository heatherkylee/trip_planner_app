class AddLatAndLngToTrips < ActiveRecord::Migration[5.2]
  def change
    add_column :trips, :lat, :decimal, precision: 13, scale: 9
    add_column :trips, :lng, :decimal, precision: 13, scale: 9
  end
end
