class CreatePlaceTrips < ActiveRecord::Migration[5.2]
  def change
    create_table :place_trips do |t|
      t.integer :trip_id
      t.integer :place_id

      t.timestamps
    end
  end
end
