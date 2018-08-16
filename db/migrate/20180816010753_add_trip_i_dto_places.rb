class AddTripIDtoPlaces < ActiveRecord::Migration[5.2]
  def change
    add_column :places, :trip_id, :integer
  end
end
