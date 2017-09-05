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

  this.facebookAUTHURL = '';

  let facebookAuthBase = 'https://www.facebook.com/v2.8/dialog/oauth';
  let facebookClientID = `client_id=${__FACEBOOK_CLIENT_ID__}`;
  let facebookRedirectURI = `redirect_uri=${__API_URL__}/api/auth/facebook_oauth_callback`;
  let facebookResponseType = 'response_type=code';
  let facebookAuthScope = 'scope=public_profile%20email%20user_likes';

  this.facebookAUTHURL = `${facebookAuthBase}?${facebookClientID}&${facebookRedirectURI}&${facebookResponseType}&${facebookAuthScope}`;

  this.checkProfile();

}
