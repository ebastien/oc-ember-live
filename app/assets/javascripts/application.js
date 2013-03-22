//= require jquery
//= require handlebars
//= require ember
//= require ember-data
//= require ember-auth
//= require bootstrap
//= require d3
//= require nv.d3
//= require_self
//= require_tree ./templates

Demo = Ember.Application.create();

Auth.Config.reopen({
  tokenCreateUrl: '/users/sign_in',
  tokenDestroyUrl: '/users/sign_out',
  tokenKey: 'auth_token',
  idKey: 'user_id',
  signInRoute: 'sign_in',
  authRedirect: true,
  signInRedirectFallbackRoute: 'index',
  signOutRedirectFallbackRoute: 'index'
});

Demo.Adapter = Auth.RESTAdapter.extend({
  namespace: 'api'
});

Demo.Store = DS.Store.extend({
  revision: 11,
  adapter: 'Demo.Adapter'
});

Demo.User = DS.Model.extend({
  email: DS.attr('string')
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

Demo.Router.map(function() {
  this.route("sign_in");
  this.resource("kpis", function() {
    this.resource("kpi", { path: ':kpi_id' });
  });
});

Demo.IndexRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo('kpis');
  }
});

Demo.SignInController = Auth.SignInController.extend({
  email: "guest@localdomain.local",
  password: "12345678",

  signIn: function () {
    this.registerRedirect();
    Auth.signIn({
      email: this.get('email'),
      password: this.get('password')
    });
  }
});

Demo.KpisRoute = Auth.Route.extend({
  model: function() {
    if (Auth.get('authToken')) {
      return Demo.Kpi.find();
    }
    return {};
  },

  events: {
    signOut: function () {
      Auth.addObserver('authToken', this, 'smartSignOutRedirect');
      Auth.signOut();
    }
  },

  smartSignOutRedirect: function() {
    if (!Auth.get('authToken')) {
      this.get('router').transitionTo(Auth.resolveRedirectRoute('signOut'));
      return Auth.removeObserver('authToken', this, 'smartSignOutRedirect');
    }
  }
});

Demo.KpiRoute = Auth.Route.extend({
  model: function(params) {
    if (Auth.get('authToken')) {
      return Demo.Kpi.find(params.kpi_id);
    }
    return {};
  },

  setupController: function(controller, model) {
    if (Auth.get('authToken')) {
      if (model.get('isLoaded') && model.get('values.length') === 0) {
        model.reload();
      }
    }
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
    var chartName = this.get('data.name');
    var chartValues = this.get('data.values');
    if (chartName && chartValues) {
      var data = [{ key: chartName, values: chartValues.toArray() }];
      var chart = this.get('chart');
      chart.datum(data)
           .transition()
           .duration(500)
           .call(this.barChart);
    }
  }.observes('data.values.@each.label',
             'data.values.@each.value',
             'data.name')
});
