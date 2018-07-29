json.array! @trips, partial: "trip", as: :trip
# json.array! @trips.each do |trip|
#   json.name trip.name
#   json.created trip.created_at
#   json.last_updated trip.updated_at
# end