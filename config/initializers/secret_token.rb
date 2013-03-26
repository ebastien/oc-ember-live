begin
  token_file = Rails.root.join ".secret_token"
  secret_token = open(token_file).read.strip
  Demo::Application.config.secret_token = secret_token
rescue LoadError, Errno::ENOENT => e
  raise "Could not load secret token: #{e}"
end
