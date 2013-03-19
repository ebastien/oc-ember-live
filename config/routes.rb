Demo::Application.routes.draw do
  mount API => '/api'
  post '/auth/:provider/callback', :to => 'ember#login'
  get '*any', :to => 'ember#index'
  get '/', :to => 'ember#index', :as => :ember_root
end
