class AddPlaceDetailstoPlace < ActiveRecord::Migration[5.2]
  def change
    add_column :places, :name, :string
    add_column :places, :address, :string
    add_column :places, :phone_number, :string
    add_column :places, :opening_hours, :string
    add_column :places, :website, :string
  end
end
