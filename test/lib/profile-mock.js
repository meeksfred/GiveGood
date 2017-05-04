'use strict';

const debug = require('debug')('givegood:profile-mock');
const userMock = require('./user-mock.js');
const Profile = require('../../model/profile.js');
const lorem = require('lorem-ipsum');

module.exports = function(done) {
  debug('profile mock');
  let exampleProfile = {
    firstName: lorem({count:2, units:'word'}),
    lastName: lorem({count:2, units:'word'}),
    phone: lorem({count: 2, units:'word'}),
  };

  userMock.call(this, err => {
    if(err) return done(err);
    exampleProfile.email = this.tempUser.email;
    exampleProfile.username = this.tempUser.username;
    exampleProfile.userID = this.tempUser._id.toString();
    new Profile(exampleProfile).save()
    .then( profile => {
      this.tempProfile = profile;
      done();
    });
  });
};
