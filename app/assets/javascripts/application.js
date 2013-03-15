//= require jquery
//= require handlebars
//= require ember
//= require ember-data
//= require bootstrap
//= require d3
//= require nv.d3
//= require_self
//= require_tree ./templates

Demo = Ember.Application.create();

Demo.Adapter = DS.RESTAdapter.extend({
  namespace: 'api'
});

Demo.Store = DS.Store.extend({
  revision: 11,
  adapter: 'Demo.Adapter'
});

Demo.Sample = DS.Model.extend({
  label: DS.attr('string'),
  value: DS.attr('number')
});

Demo.Kpi = DS.Model.extend({
  name: DS.attr('string'),
  values: DS.hasMany('Demo.Sample')
});

Demo.Adapter.map(Demo.Kpi, {
  values: { embedded: 'always' }
});

Demo.Router.reopen({
  location: 'history'
});

Demo.Router.map(function() {
  this.resource("kpis", function() {
    this.resource("kpi", { path: ':kpi_id' });
  });
});

Demo.KpisController = Ember.ArrayController.extend();

Demo.KpisRoute = Ember.Route.extend({
  model: function() {
   return Demo.Kpi.find();
  }
});

Demo.KpiRoute = Ember.Route.extend({
  setupController: function(controller, model) {
    model.reload();
  }
});

Demo.ChartView = Ember.View.extend({
  didInsertElement: function () {
    var elementId = this.get('elementId');
    var chart = d3.select('#' + elementId)
                  .append('svg:svg')
                  .attr('id','chart')
                  .attr('width', 500)
                  .attr('height', 300);
    this.set('chart', chart);
    this.updateChart();
  },

  barChart:
    nv.models.discreteBarChart()
      .x(function(d) { return d.get('label') })
      .y(function(d) { return d.get('value') })
      .tooltips(false)
      .showValues(true),

  updateChart: function () {
    var data = [{
      key: this.get('data.name'),
      values: this.get('data.values').toArray()
    }];
    var chart = this.get('chart');
    chart.datum(data)
         .transition()
         .duration(500)
         .call(this.barChart);
  }.observes('data.values.@each.value')
});
