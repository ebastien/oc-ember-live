class User < ActiveRecord::Base
  devise :database_authenticatable, :token_authenticatable

  before_save :ensure_authentication_token

  attr_accessible :email, :encrypted_password
end
