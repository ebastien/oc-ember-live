require 'tokyocabinet'

module TokyoStore
  module Connector
    attr_reader :backend

    def connect(file)
      @backend = TokyoCabinet::HDB.new
      @backend.open(file, TokyoCabinet::HDB::OWRITER | TokyoCabinet::HDB::OCREAT)
      @store = Moneta.new(:TokyoCabinet, :backend => @backend, :serializer => :json)
      adapter :memory, @store
    end
  end

  class Model
    include ActiveModel::SerializerSupport
    include Toy::Store
    extend Connector
  end
end
