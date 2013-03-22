Demo::Application.routes.draw do
  devise_for :users, :controllers => {:sessions => 'sessions'}
  scope "/api" do
    resources :kpis, :only => [:index, :show]
  end
  get '*any', :to => 'ember#index'
  get '/', :to => 'ember#index'
end
