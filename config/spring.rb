Spring.after_fork do
  TokyoStore::Registry.clean!
end