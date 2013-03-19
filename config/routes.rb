Demo::Application.routes.draw do
  mount Demo::API => '/grape'

  scope "/api" do
    resources :kpis, :only => [:index, :show]
  end
  get '*any', :to => 'ember#index'
  get '/', :to => 'ember#index'
end
