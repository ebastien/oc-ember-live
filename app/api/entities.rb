module Entities
  class Kpi < Grape::Entity
    expose :id, :name
    expose :values, :if => { :type => :full }
  end
end
