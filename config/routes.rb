Rails.application.routes.draw do
  # STEP 1: A ROUTE triggers a controller action
  # verb "/urls" => "namespace/controllers#action"
  namespace :api do
    get "/trips" => "trips#index"
    post "/trips" => "trips#create"
    get "/trips/:id" => "trips#show"
    patch "/trips/:id" => "trips#update"
    delete "/trips/:id" => "trips#destroy"

    get "/places" => "places#index"
    post "/places" => "places#create"
    get "/places/:id" => "places#show"
    # patch "/places/:id" => "places#show"
    
    post "/users" => "users#create"
  end
end
