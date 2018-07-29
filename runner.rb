require 'Unirest'

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
p "What trip would you like to update? Insert ID number"
trip_id = gets.chomp
p "Please rename your trip"

response = Unirest.patch("localhost:3000/api/trips/#{trip_id}",
  parameters: {
    input_trip_name: gets.chomp
  }
)

p response.body

# Delete a trip
# p "What trip would you like to delete? Insert ID number"
# trip_id = gets.chomp

# response = Unirest.delete("localhost:3000/api/trips/#{trip_id}")

# p response.body
