'use strict';

const debug = require('debug')('givegood:clean-db');

const User = require('../../model/user.js');

module.exports = function(done) {
  debug('clean database');

  Promise.all([
    User.remove({}),
  ])
  .then( () => done())
  .catch(done);
};
