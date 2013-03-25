module ApiHelper
  def first_match(path)
    JsonPath.on(subject, path).first
  end
end

RSpec.configure do |c|
  c.include ApiHelper, :type => :controller
end