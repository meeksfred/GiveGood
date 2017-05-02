'use strict';

// npm modules
const expect = require('chai').expect;
const request = require('superagent');
const Promise = require('bluebird');
const mongoose = require('mongoose');

// app modules
const serverCtrl = require('./lib/server-control.js');
const cleanDB = require('./lib/clean-db.js');
const mockUser = require('./lib/user-mock.js');

mongoose.Promise = Promise;

// module constants
const server = require('../server.js');
const url = `http://localhost:${process.env.PORT}`;

const exampleProfile = {
  firstName: 'Scout',
  lastName: 'Test',
  email: 'test@test.com',
  phone: '(111)111-1111',
  username: 'scouttest',
};

describe('testing profile-router', function() {

  before( done => serverCtrl.serverUp(server, done));

  after( done => serverCtrl.serverDown(server, done));

  afterEach( done => cleanDB(done));

  describe('testing POST /api/profile', function() {

    describe('with a valid body', function() {

      before( done => mockUser.call(this, done));

      it('should return a profile and status 200', (done) => {

        request.post(`${url}/api/profile`)
        .send(exampleProfile)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.firstName).to.equal(exampleProfile.firstName);
          expect(res.body.lastName).to.equal(exampleProfile.lastName);
          expect(res.body.email).to.equal(this.tempUser.email);
          expect(res.body.username).to.equal(this.tempUser.username);
          expect(res.body.phone).to.equal(exampleProfile.phone);
          done();
        });
      });
    });


  });
});
