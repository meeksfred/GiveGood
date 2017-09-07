'use strict';

module.exports = ['$q', '$log', '$http', '$window', 'Facebook', fbService];

function fbService($q, $log, $http, $window, Facebook) {
  $log.debug('init fbService');

  let service = {};

  service.checkLoginStatus = function() {
    return Facebook.getLoginStatus(function(response) {
      return $q.resolve(response);
    });
  };

  return service;
}
