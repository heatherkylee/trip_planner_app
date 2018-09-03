class AddLatAndLngToPlaces < ActiveRecord::Migration[5.2]
  def change
    add_column :places, :lat, :decimal, precision: 13, scale: 9
    add_column :places, :lng, :decimal, precision: 13, scale: 9
  end
end
