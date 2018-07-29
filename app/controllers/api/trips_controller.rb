class Api::TripsController < ApplicationController
  def index
    @trips = Trip.all.order("id")
    render "index.json.jbuilder"
  end

  def create
    @trip = Trip.new(
      name: params[:input_trip_name])
    @trip.save
    render "show.json.jbuilder"
  end

  def show
    @trip = Trip.find_by(id: params[:id])
    render "show.json.jbuilder"
  end

  def update
    @trip = Trip.find_by(id: params[:id])
    @trip.name = params[:input_trip_name] || @trip.name
    @trip.save
    render "show.json.jbuilder"
  end

  def destroy
    trip = Trip.find_by(id: params[:id])
    trip.destroy
    render json: {message: "Trip has been deleted."}
  end
end
