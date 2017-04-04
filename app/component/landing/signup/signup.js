'use strict';

require('./_signup.scss');

module.exports = {
  template: require('./signup.html'),
  controller: ['$log', '$location', 'authService', SignupController],
  controllerAs: 'signupCtrl',
};

function SignupController($log, $location, authService) {
  $log.debug('init signupCtrl');

  this.signup = function(user) {
    authService.signup(user)
    .then( () => {
      $location.url('/home');
    })
    .catch( () => {
      $log.debug('signup failed');
    });
  };

}
