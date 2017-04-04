'use strict';

require('./_home.scss');

module.exports = ['$log', '$location', 'authService', HomeController];

function HomeController($log, $location, authService) {
  $log.debug('init homeCtrl');

  this.logout = function() {
    $log.debug('homeCtrl.logout()');
    authService.logout()
    .then( () => {
      $location.url('/');
    });
  };
}
