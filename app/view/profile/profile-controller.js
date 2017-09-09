'use strict';

require('./_profile.scss');

module.exports = ['$log', 'profileService', 'facebookService', 'Facebook', ProfileController];

function ProfileController($log, profileService, facebookService, Facebook) {
  $log.debug('init profileCtrl');

  this.profile;
  this.hasProfile = false;
  this.fbLogged = false;
  this.fbTemp;

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

  this.intentLogin = function() {
    // if ( this.fbLogged ) {
    //   // this.me();
    // } else {
    this.login();
    // }
  };

  this.login = function() {
    console.log('login??');
    return facebookService.login()
    .then( response => {
      console.log('fb Temp??');
      this.fbTemp = response;
    });
  };

  this.getLoginStatus = function() {
    return facebookService.checkLoginStatus()
    .then( response => {
      if (response.status === 'connected') {
        this.fbLogged = true;
        console.log('Hello');
      }
    });
  };

  this.me = function() {
    Facebook.api('/me', function(response) {
      this.fbProfile = response;
    });
  };

  // this.facebookAUTHURL = '';
  //
  // let facebookAuthBase = 'https://www.facebook.com/v2.8/dialog/oauth';
  // let facebookClientID = `client_id=${__FACEBOOK_CLIENT_ID__}`;
  // let facebookRedirectURI = `redirect_uri=${__API_URL__}/api/auth/facebook_oauth_callback`;
  // let facebookResponseType = 'response_type=code';
  // let facebookAuthScope = 'scope=public_profile%20email%20user_likes';
  //
  // this.facebookAUTHURL = `${facebookAuthBase}?${facebookClientID}&${facebookRedirectURI}&${facebookResponseType}&${facebookAuthScope}`;

  this.checkProfile();
  this.getLoginStatus();

}
