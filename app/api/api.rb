class API < Grape::API

  version 'v1', :using => :path
  format :json

  resource :kpis do
    desc "Return a collection of KPIs."
    get :all do
      kpi = Kpi.read("1")
      KpiSerializer.new kpi
    end
  end
end
