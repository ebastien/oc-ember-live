class EmberController < ActionController::Base
  def login
    logger.debug request.env['omniauth.auth']
    redirect_to ember_root_url
  end
end
