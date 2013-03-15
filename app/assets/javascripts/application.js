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
