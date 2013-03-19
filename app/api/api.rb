class API < Grape::API
  version 'v1', :using => :path
  format :json
  rescue_from :all

  resource :kpis do
    desc "Return a summary of KPIs."
    get '/' do
      kpis = [1,2].map { |i| Kpi.read(i.to_s) }.compact
      present kpis, :with => Entities::Kpi, :root => :kpis, :type => :summary
    end

    desc "Return a KPI with its values."
    get ':id' do
      kpi = Kpi.read(params[:id])
      sleep 3 # Simulate very slow retrieval performances
      unless kpi
        error! "kpi not found", 404
      end
      present kpi, :with => Entities::Kpi, :root => :kpi, :type => :full
    end
  end

  route :any, '*path' do
    error! "not found", 404
  end
end
