'use strict';

module.exports = ['$q', '$log', '$http', 'authService', profileService];

function profileService($q, $log, $http, authService) {
  $log.debug('init profileService');

  let service = {};

  service.createProfile = function(profile) {
    $log.debug('profileService.createProfile()');

    return authService.getToken()
    .then( token => {
      let url = `${__API_URL__}/api/profile`;
      let config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      return $http.post(url, profile, config);
    })
    .then( res => {
      let profile = res.data;
      return profile;
    })
    .catch( err => {
      $log.error(err.message);
      return $q.reject(err);
    });
  };

  service.getProfile = function() {
    $log.debug('profileService.getProfile()');

    return authService.getToken()
    .then( token => {
      let url = `${__API_URL__}/api/profile/me`;
      let config = {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      return $http.get(url, config);
    })
    .then( res => {
      let profile = res.data;
      return profile;
    })
    .catch( err => {
      $log.error(err.message);
      return $q.reject(err);
    });
  };

}
