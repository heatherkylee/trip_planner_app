Rails.application.routes.draw do
  # STEP 1: A ROUTE triggers a controller action
  # verb "/urls" => "namespace/controllers#action"
  namespace :api do
    get "/trips" => "trips#index"
    get "/trips/:id" => "trips#show"
  end
end
