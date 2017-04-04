'use strict';

module.exports = ['$stateProvider', '$urlRouterProvider', routerConfig];

function routerConfig($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.when('' , '/');
  // $urlRouterProvider.when('/' , '/landing');

  let states = [
    {
      name: 'welcome',
      url: '/',
      controllerAs: 'landingCtrl',
      controller: 'LandingController',
      template: require('../view/landing/landing.html'),
    },
    {
      name: 'home',
      url: '/home',
      controllerAs: 'homeCtrl',
      controller: 'HomeController',
      template: require('../view/home/home.html'),
    },
  ];

  states.forEach(state => {
    $stateProvider.state(state);
  });
}
