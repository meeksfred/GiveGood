'use strict';

require('./_home.scss');

module.exports = ['$log', '$location', 'authService', 'profileService', HomeController];

function HomeController($log, $location, authService, profileService) {
  $log.debug('init homeCtrl');

  this.profile;
  this.hasProfile = false;

  this.checkProfile = function() {
    $log.debug('init homeCtrl.checkProfile()');
    profileService.getProfile()
    .then( profile => {
      this.profile = profile;
      this.hasProfile = true;
    });
  };

  this.checkProfile();

}
