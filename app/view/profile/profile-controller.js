'use strict';

require('./_profile.scss');

module.exports = ['$log', 'profileService', 'facebookService', 'authService', 'Facebook', ProfileController];

function ProfileController($log, profileService, facebookService, authService, Facebook) {
  $log.debug('init profileCtrl');

  this.profile;
  this.hasProfile = false;
  this.fbLogged = false;
  this.fbTemp;

  this.createProfile = function(profile) {
    $log.debug('hit profileCtrl.createProfile()');
    profileService.createProfile(profile)
    .then( profile => {
      this.profile = profile;
      this.hasProfile = true;
    });
  };

  this.checkProfile = function() {
    $log.debug('hit profileCtrl.checkProfile()');

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
    this.fbLogin();
    // }
  };

  this.fbLogin = function() {
    $log.debug('hit login()');

    console.log('login??');
    return facebookService.login()
    .then( response => {
      console.log('fb Temp??');
      this.fbTemp = response;
    });
  };

  this.getLoginStatus = function() {
    $log.debug('hit getLoginStatus()');

    return facebookService.checkLoginStatus()
    .then( response => {
      if (response.status === 'connected') {
        let fbAuthInfo = {
          facebook: {
            facebookID: response.authResponse.userID,
            accessToken: response.authResponse.accessToken,
            tokenTTL: response.authResponse.expiresIn,
            tokenTimeStamp: Date.now(),
          },
        };
        return authService.updateSocialUser(fbAuthInfo)
        .then( response => {
          console.log(response, 'response?');
        })
        .catch( err => {
          console.error(err);
        });
      }

      console.log(response.status);
    });
  };

  // this.facebookProfileUpdate = function(authObj) {
  //   $log.debug('hit facebookProfileUpdate()');
  //
  //   let fbAuthInfo = {
  //     facebook: {
  //       facebookID: authObj.authResponse.userID,
  //       accessToken: authObj.authResponse.accessToken,
  //       tokenTTL: authObj.authResponse.expiresIn,
  //       tokenTimeStamp: Date.now(),
  //     },
  //   };
  //   return authService.updateSocialProfile(fbAuthInfo)
  //   .then( profile => {
  //     console.log(profile, 'profile???');
  //     this.profile = profile;
  //   })
  //   .catch( err => {
  //     console.error(err);
  //   });
  // };

  this.facebookLikesUpdate = function(data) {
    $log.debug('hit facebookLikesUpdate()');

    let fbLikes = {
      facebookLikes: data.likes.data,
    };
    return profileService.updateSocialLikes(this.profile, fbLikes)
    .then( profile => {
      console.log(profile, 'profile with likes???');
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
      this.facebookLikesUpdate(response);
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
