Demo::Application.routes.draw do
  mount Demo::API => '/api'
  get '*any', :to => 'ember#index'
  get '/', :to => 'ember#index'
end
