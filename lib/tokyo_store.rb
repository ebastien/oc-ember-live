require 'tokyocabinet'

module TokyoStore

  class Registry
    def self.register(db)
      @dbs ||= []
      @dbs << db
    end

    def self.clean!
      @dbs.each { |db| db.close } if @dbs
      @dbs = []
    end
  end

  module Connector
    def connect(path)

      directory, filename = File.split path
      env_filename = Rails.env.production? ? filename : "#{Rails.env}_#{filename}"
      env_path = File.join directory, env_filename

      db = TokyoCabinet::HDB.new
      db.open(env_path, TokyoCabinet::HDB::OWRITER | TokyoCabinet::HDB::OCREAT)
      TokyoStore::Registry.register db

      store = Moneta.new(:TokyoCabinet, :backend => db, :serializer => :json)
      adapter :memory, store
    end
  end

  class Model
    include ActiveModel::SerializerSupport
    include Toy::Store
    extend Connector
  end
end
