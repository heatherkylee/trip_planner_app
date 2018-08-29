class ChangeOpeningHoursTextToArray < ActiveRecord::Migration[5.2]
  def change
    remove_column :places, :opening_hours, :string
  end
end
