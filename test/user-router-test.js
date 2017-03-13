'use strict';

// npm modules
const expect = require('chai').expect;
const request = require('superagent');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const validator = require('validator');

// app modules
const serverCtrl = require('./lib/server-control.js');

// module constants
const server = require('../server.js');
const url = `http://localhost:${process.env.PORT}`;

mongoose.Promise = Promise;

// MAKE SURE TO MAKE A DB DELETE OPERATION ****************

let exampleUser = {
  username: 'helloWorld',
  password: 'password',
  email: 'test@test.com',
};

describe('testing user-router', function() {

  before( done => serverCtrl.serverUp(server, done));

  after( done => serverCtrl.serverDown(server, done));

  describe('testing POST /api/signup', function() {

    describe('with a valid body', function() {

      it('should return a token', (done) => {

        request.post(`${url}/api/signup`)
        .send(exampleUser)
        .end((err, res) => {
          if (err)
            return done(err);
          expect(res.status).to.equal(200);
          expect(validator.isEmail(exampleUser.email)).to.equal(true);
          done();
        });
      });
    });
  });

  describe('sample test', () => {

    it('should pass', () => {
      expect(true).to.equal(true);
    });
  });
});
