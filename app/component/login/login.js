'use strict';

require('./_login.scss');

module.exports = {
  template: require('./login.html'),
  controller: ['$log', '$location', 'authService', LoginController],
  controllerAs: 'loginCtrl',
};

function LoginController($log, $location, authService) {
  $log.debug('init loginCtrl');
}
