class KpisController < ApplicationController

  KPI_IDS = ["1", "2"]

  def index
    kpis = KPI_IDS.map { |i| Kpi.read(i) }.compact
    render :json => kpis, :scope => :summary
  end

  def show
    kpi = Kpi.read(params[:id])
    if kpi
      render :json => kpi, :scope => :full
    else
      render :json => {}, :status => 404
    end
  end
end
