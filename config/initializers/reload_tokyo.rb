require 'tokyo_store'

if Rails.env.development?
  ActionDispatch::Callbacks.to_prepare do
    TokyoStore::Registry.clean!
  end
end
