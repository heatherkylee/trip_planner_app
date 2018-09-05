class Api::TripsController < ApplicationController
  def index
    # @trips = Trip.all
    if current_user
      @trips = current_user.trips.order(:name)
      render "index.json.jbuilder"
    else
      render json: []
    end
  end

  def create
    @trip = Trip.new(
      name: params[:name],
      location: params[:location],
      lat: params[:lat],
      lng: params[:lng],
      user_id: current_user.id
    )
    @trip.save
    render "show.json.jbuilder"
  end

  def show
    @trip = Trip.find_by(id: params[:id])
    render "show.json.jbuilder"
  end

  def update
    @trip = Trip.find_by(id: params[:id])
    @trip.name = params[:name] || @trip.name
    @trip.location = params[:location] || @trip.location
    @trip.lat = params[:lat] || @trip.lat
    @trip.lng = params[:lng] || @trip.lng
    @trip.user_id = current_user.id
    @trip.save
    render "show.json.jbuilder"
  end

  def destroy
    trip = Trip.find_by(id: params[:id])
    trip.destroy
    render json: {message: "Trip has been deleted."}
  end
end
