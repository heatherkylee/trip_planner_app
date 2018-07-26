class Api::TripsController < ApplicationController
  def index
    @trips = Trips.all
    render "index.json.jbuilder"
  end

  def show
    render "show.json.jbuilder"
  end
end
