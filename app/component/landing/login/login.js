'use strict';

require('./_login.scss');

module.exports = {
  template: require('./login.html'),
  controller: ['$log', '$location', 'authService', LoginController],
  controllerAs: 'loginCtrl',
};

function LoginController($log, $location, authService) {
  $log.debug('init loginCtrl');

  this.login = function(user) {
    authService.login(user)
    .then( () => {
      $location.url('/home');
    })
    .catch( () => {
      $log.debug('login failed');
    });
  };
}
