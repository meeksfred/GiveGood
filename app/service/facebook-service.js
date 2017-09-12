'use strict';

module.exports = ['$q', '$log', '$http', '$window', 'Facebook', fbService];

function fbService($q, $log, $http, $window, Facebook) {
  $log.debug('init fbService');

  let service = {};

  service.checkLoginStatus = function() {
    return Facebook.getLoginStatus( response => {
      return $q.resolve(response); // not tested
    });
  };

  service.login = function() {
    return Facebook.login( response => {
      console.log(response, 'Response');
      if (response.authResponse) {
        return $q.resolve(response);
      }
    }, {
      scope: 'public_profile,email,user_likes',
      return_scopes: true,
    });
  };

  service.getFacebookLikes = function() {
    return Facebook.api('/me', 'get', {fields: 'likes'}, (response) => {
      console.log(response, 'api call');
      console.log(response.likes.data, 'like data?');
      return $q.resolve(response);
    });
  };

  return service;
}
