'use strict';

require('./_home.scss');

module.exports = ['$log', '$location', 'authService', HomeController];

function HomeController($log, $location, authService) {
  $log.debug('init homeCtrl');

  this.data; // need to make a GET route for a profile to get data of user on Home view. Not sure I can make a binding from the login/signup components

  // once I have user data within the home view, setup a simple dropdown or button for now to make sure deleting a user account works. send the view back to landing on successful deletion.

  this.logout = function() {
    $log.debug('homeCtrl.logout()');
    authService.logout()
    .then( () => {
      $location.url('/');
    });
  };
}
