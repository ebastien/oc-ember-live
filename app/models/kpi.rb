class Kpi < TokyoStore::Model
  connect 'db/cube.tch'

  attribute :name, String
  attribute :values, Array
end
