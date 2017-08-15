'use strict';

module.exports = ['$stateProvider', '$urlRouterProvider', routerConfig];

function routerConfig($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.when('' , '/');

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
    {
      name: 'profile',
      url: '/profile',
      controllerAs: 'profileCtrl',
      controller: 'ProfileController',
      template: require('../view/profile/profile.html'),
    },
  ];

  // Might need a route for viewing the profile of a specific id, ie. /profile/12345

  states.forEach(state => {
    $stateProvider.state(state);
  });
}
