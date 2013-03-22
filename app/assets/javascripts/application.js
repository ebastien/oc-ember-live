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

Demo.KpiController = Ember.Controller.extend({
  chartParams: {showValues: true}
});

Demo.ChartView = Ember.View.extend({
  didInsertElement: function () {
    var elementId = this.get('elementId');
    this.set('elementId', elementId);
    this.updateChart();
  },

  updateChart: function () {
    var chartName = this.get('data.name'),
        chartValues = this.get('data.values');

    if (chartName && chartValues.get('length')) {
      var data = [{ key: chartName, values: chartValues.toArray() }],
          elementId = this.get('elementId'),
          showValues = this.get('params.showValues');

      var barChart = nv.models.discreteBarChart()
                       .x(function(d) { return d.get('label') })
                       .y(function(d) { return d.get('value') })
                       .tooltips(false)
                       .showValues(showValues);

      var element = d3.select('#' + elementId);

      element.select('svg').remove();

      element.append('svg:svg')
             .attr('id','chart')
             .attr('width', 500)
             .attr('height', 300)
             .datum(data)
             .call(barChart);
    }
  }.observes('data.values.length',
             'data.name',
             'params.showValues')
});
