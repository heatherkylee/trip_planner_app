class Api::PlacesController < ApplicationController
  def index
    @places = Place.all
    render "index.json.jbuilder"
  end

  def create
    # need to search through existing places to see if it already exists, otherwise, create and save new in table
    input_google_id = params[:input_google_id]
    new_place = Place.find_by(google_id: input_google_id)
    if new_place
      p "This is already in the table"
      render "show.json.jbuilder"
    else
      @place = Place.new(google_id: input_google_id)
      @place.save
      p "New place saved to the table"
      render "show.json.jbuilder"
    end
  end

  def show
    @place = Place.find_by(id: params[:id])
    render "show.json.jbuilder"
  end
end
