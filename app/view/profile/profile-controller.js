'use strict';

require('./_profile.scss');

module.exports = ['$log', ProfileController];

function ProfileController($log) {
  $log.debug('init profileCtrl');

  this.profile;
}
