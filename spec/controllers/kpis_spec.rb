require "spec_helper"

describe KpisController do

  let(:kpi) { Fabricate(:kpi) }
  before { kpi } # initialize it

  describe "GET show" do

    before { get :show, id: kpi.id }
    subject(:json) { JSON.parse response.body }

    it "returns our KPI" do
      expect(json["kpi"]["name"]).to eq(kpi.name)
    end
  end
end