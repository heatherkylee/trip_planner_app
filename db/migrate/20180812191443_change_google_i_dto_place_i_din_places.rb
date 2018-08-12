class ChangeGoogleIDtoPlaceIDinPlaces < ActiveRecord::Migration[5.2]
  def change
    rename_column :places, :google_id, :place_id
  end
end
