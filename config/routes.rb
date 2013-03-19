Demo::Application.routes.draw do
  mount API => '/api'
  get '*any', :to => 'ember#index'
  get '/', :to => 'ember#index'
end
