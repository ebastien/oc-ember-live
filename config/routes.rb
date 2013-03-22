Demo::Application.routes.draw do
  # Authentication routes
  devise_for :users, :controllers => {:sessions => 'sessions'}
  
  # API routes
  scope "/api" do
    resources :kpis, :only => [:index, :show]
  end
  
  # Catch-all routes
  get '*any', :to => 'ember#index'
  get '/', :to => 'ember#index'
end
