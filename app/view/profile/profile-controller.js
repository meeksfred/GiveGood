'use strict';

require('./_profile.scss');

module.exports = ['$log', 'profileService', ProfileController];

function ProfileController($log, profileService) {
  $log.debug('init profileCtrl');

  this.profile;
  this.hasProfile = false;

  this.createProfile = function(profile) {
    $log.debug('init profileCtrl.createProfile()');
    profileService.createProfile(profile)
    .then( profile => {
      this.profile = profile;
      this.hasProfile = true;
    });
  };

  this.checkProfile = function() {
    $log.debug('init profileCtrl.checkProfile()');

    profileService.getProfile()
    .then( profile => {
      this.profile = profile;
      this.hasProfile = true;
    });
  };

  this.checkProfile();

}
