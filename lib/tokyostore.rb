require 'tokyocabinet'

module TokyoStore

  class Registry
    def self.register(db)
      @dbs ||= []
      @dbs << db
    end

    def self.clean!
      @dbs.each { |db| db.close } if @dbs
    end
  end

  module Connector
    def connect(file)
      db = TokyoCabinet::HDB.new
      db.open(file, TokyoCabinet::HDB::OWRITER | TokyoCabinet::HDB::OCREAT)
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
