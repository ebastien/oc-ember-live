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
