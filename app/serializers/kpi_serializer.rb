class KpiSerializer < ActiveModel::Serializer
  attributes :id, :name, :values

  def include_values?
    scope == :full
  end
end
