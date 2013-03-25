require "spec_helper"

describe KpisController do

  let(:kpi) { Fabricate(:kpi) }

  describe "GET show" do

    before { get :show, id: kpi.id }
    subject(:body) { response.body }

    it "returns our KPI" do
      expect(first_match '$.kpi.name').to eq(kpi.name)
    end
  end
end