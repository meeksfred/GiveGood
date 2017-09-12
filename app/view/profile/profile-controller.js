'use strict';

require('./_profile.scss');

module.exports = ['$log', 'profileService', 'facebookService', 'Facebook', ProfileController];

function ProfileController($log, profileService, facebookService, Facebook) {
  $log.debug('init profileCtrl');

  this.profile;
  this.hasProfile = false;
  this.fbLogged = false;
  this.fbTemp;
  this.fbLikes;

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
        this.facebookProfileUpdate(response);
      }

      this.fbLogged = false;
      console.log(response, 'check status response');
    });
  };

  this.facebookProfileUpdate = function(authObj) {
    let fbAuthInfo = {
      facebook: {
        facebookID: authObj.authResponse.userID,
        accessToken: authObj.authResponse.accessToken,
        tokenTTL: authObj.authResponse.expiresIn,
        tokenTimeStamp: Date.now(),
      },
    };
    return profileService.updateSocialProfile(this.profile, fbAuthInfo)
    .then( profile => {
      console.log(profile, 'profile???');
      this.profile = profile;
    })
    .catch( err => {
      console.error(err);
    });
  };

  this.getFacebookLikes = function() {
    return facebookService.getFacebookLikes()
    .then( response => {
      console.log('Hello', response);
      this.fbLikes = response.likes.data;
    })
    .catch( err => {
      console.error(err);
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
