class Place < ApplicationRecord
  # has_many :place_trips
  # has_many :trips, through: :place_trips
  belongs_to :trip
end
