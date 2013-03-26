
desc "Distribute the application as a Debian package."
task :dist

desc "Bundle the application for deployment."
task :bundle do
  system("bundle install --deployment --binstubs --standalone --without test development assets")
end
