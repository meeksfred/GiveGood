'use strict';

module.exports = ['$q', '$log', '$http', '$window', authService];

function authService($q, $log, $http, $window) {
  $log.debug('init authService');

  let service = {};
  let token = null;

  service.setToken = function(_token) {
    $log.debug('authService.service.setToken()');

    if (!_token)
      return $q.reject(new Error('no service.token'));

    $window.localStorage.setItem('token', _token);
    service.token = _token;
    return $q.resolve(service.token);
  };

  return service;
}
