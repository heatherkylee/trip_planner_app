require 'Unirest'

# ********TRIPS**************

# Create action to create new trip
# p "What is the name of the trip?"
# input_trip_name = gets.chomp

# response = Unirest.post("localhost:3000/api/trips",
#   parameters: {
#     name: input_trip_name
#   }
# )

# p response.body

# Update a trip name
# p "What trip would you like to update? Insert ID number"
# trip_id = gets.chomp
# p "Please rename your trip"

# response = Unirest.patch("localhost:3000/api/trips/#{trip_id}",
#   parameters: {
#     input_trip_name: gets.chomp
#   }
# )

# p response.body

# Delete a trip
# p "What trip would you like to delete? Insert ID number"
# trip_id = gets.chomp

# response = Unirest.delete("localhost:3000/api/trips/#{trip_id}")

# p response.body

# ********** PLACES *************

# Create action to add a new place to your trip
# p "What is the name of the place?"
# input_google_id = gets.chomp

# response = Unirest.post("localhost:3000/api/places",
#   parameters: {
#     google_id: input_google_id
#   }
# )

# p response.body

# new_place = Place.find_by(google_id: "aaaaa")
# if new_place
#   p "This is already in the table"
#   # render "show.json.jbuilder"
# else
#   @place = Place.new(google_id: params[:input_google_id])
#   @place.save
#   p "New place saved to the table"
#   # render "show.json.jbuilder"
# end

p Place.all