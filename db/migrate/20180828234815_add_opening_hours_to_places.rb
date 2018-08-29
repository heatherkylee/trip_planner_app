class AddOpeningHoursToPlaces < ActiveRecord::Migration[5.2]
  def change
    add_column :places, :opening_hours, :string, array: true, default: []
  end
end
