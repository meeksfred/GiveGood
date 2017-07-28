'use strict';

require('./_navbar.scss');

module.exports = {
  template: require('./navbar.html'),
  controller: ['$log', '$location', NavbarController],
  controllerAs: 'navbarCtrl',
  bindings: {
    profile: '<',
  },
};

function NavbarController($log, $location) {
  $log.debug('init navbarCtrl');


  this.toProfile = function() {
    $location.url('/profile');
  };

  this.toHome = function() {
    $location.url('/home');
  };
}
