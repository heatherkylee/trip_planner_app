class Api::PlacesController < ApplicationController
  def index
    @places = Place.all
    render "index.json.jbuilder"
  end

  def create
    # need to search through existing places to see if it already exists, otherwise, create and save new in table
    # input_google_id = params[:input_google_id]
    # new_place = Place.find_by(google_id: input_google_id)
    # if new_place
    #   p "This is already in the table"
    #   render "show.json.jbuilder"
    # else
    #   @place = Place.new(google_id: input_google_id)
    #   @place.save
    #   p "New place saved to the table"
    #   render "show.json.jbuilder"
    # end
    @place = Place.new(
        place_id: params[:place_id],
        trip_id: params[:trip_id],
        name: params[:name],
        address: params[:address],
        phone_number: params[:phone_number],
        opening_hours: params[:opening_hours] || "",
        website: params[:website]
      )
    @place.save!
    render "show.json.jbuilder"
  end


  def show
    @place = Place.find_by(id: params[:id])
    render "show.json.jbuilder"
  end
end
