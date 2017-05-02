'use strict';

const debug = require('debug')('givegood:clean-db');

const User = require('../../model/user.js');
const Profile = require('../../model/profile.js');

module.exports = function(done) {
  debug('clean database');

  Promise.all([
    User.remove({}),
    Profile.remove({}),
  ])
  .then( () => done())
  .catch(done);
};
