'use strict';

require('./_navbar.scss');

module.exports = {
  template: require('./navbar.html'),
  controller: ['$log', '$location', 'authService', NavbarController],
  controllerAs: 'navbarCtrl',
  bindings: {
    profile: '<',
  },
};

function NavbarController($log, $location, authService) {
  $log.debug('init navbarCtrl');


  this.toProfile = function() {
    $location.url('/profile');
  };

  this.toHome = function() {
    $location.url('/home');
  };

  this.logout = function() {
    $log.debug('homeCtrl.logout()');
    authService.logout()
    .then( () => {
      $location.url('/');
    });
  };
}
