'use strict';

require('./lib/test-env.js');

// npm modules
const expect = require('chai').expect;
const request = require('superagent');
const Promise = require('bluebird');
const mongoose = require('mongoose');

// app modules
const serverCtrl = require('./lib/server-control.js');
const cleanDB = require('./lib/clean-db.js');
const mockUser = require('./lib/user-mock.js');
const mockProfile = require('./lib/profile-mock.js');

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

// username and email are provided/attached by accessing User model in route.

describe('testing profile-router', function() {

  before( done => serverCtrl.serverUp(server, done));

  after( done => serverCtrl.serverDown(server, done));

  afterEach( done => cleanDB(done));

  describe('testing POST /api/profile', function() {

    describe('with a valid request', function() {

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
          expect(res.body.userID).to.equal(this.tempUser._id.toString());
          done();
        });
      });
    });

    describe('with no firstName', function() {

      before( done => mockUser.call(this, done));

      it('should return an error, status 400', (done) => {

        request.post(`${url}/api/profile`)
        .send({
          lastName: 'Test',
          phone: '(111)111-1111',
        })
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('BadRequestError');
          done();
        });
      });
    });

    describe('with no lastName', function() {

      before( done => mockUser.call(this, done));

      it('should return an error, status 400', (done) => {

        request.post(`${url}/api/profile`)
        .send({
          firstName: 'Scout',
          phone: '(111)111-1111',
        })
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('BadRequestError');
          done();
        });
      });
    });

    describe('with no phone', function() {

      before( done => mockUser.call(this, done));

      it('should return an error, status 400', (done) => {

        request.post(`${url}/api/profile`)
        .send({
          firstName: 'Scout',
          lastName: 'Test',
        })
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('BadRequestError');
          done();
        });
      });
    });

    describe('with invalid date-string', function() {

      before( done => mockUser.call(this, done));

      it('should return an error, status 400', (done) => {

        request.post(`${url}/api/profile`)
        .send({
          firstName: 'Scout',
          lastName: 'Test',
          phone: '(111)111-1111',
          created: 'today',
        })
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with no Auth', function() {

      before( done => mockUser.call(this, done));

      it('should return an error, status 400', (done) => {

        request.post(`${url}/api/profile`)
        .send(exampleProfile)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('BadRequestError');
          done();
        });
      });
    });

    describe('with Bearer heading but no token', function() {

      before( done => mockUser.call(this, done));

      it('should return an error, status 400', (done) => {

        request.post(`${url}/api/profile`)
        .send(exampleProfile)
        .set({
          Authorization: `Bearer `,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('BadRequestError');
          done();
        });
      });
    });

    describe('with endpoint that doesnt exist', function() {

      before( done => mockUser.call(this, done));

      it('should return an error, status 404', (done) => {

        request.post(`${url}/api/userProfile`)
        .send(exampleProfile)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    describe('with a username that already exists', function() {

      before( done => mockProfile.call(this, done));

      it('should return an error, status 409', (done) => {

        request.post(`${url}/api/profile`)
        .send({
          firstName: exampleProfile.firstName,
          lastName: exampleProfile.lastName,
          email: exampleProfile.email,
          phone: exampleProfile.phone,
          username: this.tempProfile.username,
        })
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          expect(res.status).to.equal(409);
          done();
        });
      });
    });

    describe('with an email that already exists', function() {

      before( done => mockProfile.call(this, done));

      it('should return an error, status 409', (done) => {

        request.post(`${url}/api/profile`)
        .send({
          firstName: exampleProfile.firstName,
          lastName: exampleProfile.lastName,
          email: this.tempProfile.email,
          phone: exampleProfile.phone,
          username: exampleProfile.username,
        })
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          expect(res.status).to.equal(409);
          done();
        });
      });
    });

    describe('with a phone number that already exists', function() {

      before( done => mockProfile.call(this, done));

      it('should return an error, status 409', (done) => {

        request.post(`${url}/api/profile`)
        .send({
          firstName: exampleProfile.firstName,
          lastName: exampleProfile.lastName,
          email: exampleProfile.email,
          phone: this.tempProfile.phone,
          username: exampleProfile.username,
        })
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          expect(res.status).to.equal(409);
          done();
        });
      });
    });
  });

  describe('testing GET /api/profile/me', function() {

    describe('with a valid request', function() {

      before( done => mockProfile.call(this, done));

      it('should return a profile', (done) => {

        request.get(`${url}/api/profile/me`)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.firstName).to.equal(this.tempProfile.firstName);
          expect(res.body.lastName).to.equal(this.tempProfile.lastName);
          expect(res.body.email).to.equal(this.tempProfile.email);
          expect(res.body.username).to.equal(this.tempProfile.username);
          expect(res.body.phone).to.equal(this.tempProfile.phone);
          done();
        });
      });
    });

    describe('with no Auth header', function() {

      before( done => mockProfile.call(this, done));

      it('should return an error, status 400', (done) => {

        request.get(`${url}/api/profile/me`)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('BadRequestError');
          done();
        });
      });
    });

    describe('with Bearer header but no token', function() {

      before( done => mockProfile.call(this, done));

      it('should return an error, status 400', (done) => {

        request.get(`${url}/api/profile/me`)
        .set({
          Authorization: `Bearer `,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('BadRequestError');
          done();
        });
      });
    });

    describe('with incorrect endpoint', function() {

      before( done => mockProfile.call(this, done));

      it('should return an error, status 404 endpoint not found', (done) => {

        request.get(`${url}/api/profile/notme`)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    describe('when a user doesn\'t have a profile yet', function() {

      before( done => mockUser.call(this, done));

      it('should return an error, status 404 profile not found', (done) => {

        request.get(`${url}/api/profile/me`)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.text).to.equal('NotFoundError');
          done();
        });
      });
    });
  });

  describe('testing PUT /api/profile/:profileID', function() {

    describe('updating username and email for Profile and User', function() {

      before( done => mockProfile.call(this, done));

      it('should return an updated profile', (done) => {
        let updateData = {
          username: 'helloWorld',
          email: 'bob@bob.com',
        };

        request.put(`${url}/api/profile/${this.tempProfile._id}`)
        .send(updateData)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          console.log('res.body', res.body);
          expect(res.body.username).to.equal(updateData.username);
          expect(res.body.email).to.equal(updateData.email);
          done();
        });
      });
    });

    describe('updating only firstName for Profile', function() {

      before( done => mockProfile.call(this, done));

      it('should return an updated profile', (done) => {
        let updateData = {
          firstName: 'Scout',
        };

        request.put(`${url}/api/profile/${this.tempProfile._id}`)
        .send(updateData)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.firstName).to.equal(updateData.firstName);
          done();
        });
      });
    });

    describe('updating only lastName for Profile', function() {

      before( done => mockProfile.call(this, done));

      it('should return an updated profile', (done) => {
        let updateData = {
          lastName: 'Scooter',
        };

        request.put(`${url}/api/profile/${this.tempProfile._id}`)
        .send(updateData)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.lastName).to.equal(updateData.lastName);
          done();
        });
      });
    });

    describe('updating only phone number for Profile', function() {

      before( done => mockProfile.call(this, done));

      it('should return an updated profile', (done) => {
        let updateData = {
          phone: '111-111-1111',
        };

        request.put(`${url}/api/profile/${this.tempProfile._id}`)
        .send(updateData)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.phone).to.equal(updateData.phone);
          done();
        });
      });
    });

    describe('with valid token and invalid Profile id', function() {

      before( done => mockProfile.call(this, done));

      it('should return a 404 for profile not found', (done) => {
        let updateData = {
          firstName: 'Hello',
        };

        request.put(`${url}/api/profile/12345`)
        .send(updateData)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    describe('updated with empty required field', function() {

      before( done => mockProfile.call(this, done));

      it('should return a 400 for bad request', (done) => {
        let updateData = {
          username: '',
        };

        request.put(`${url}/api/profile/${this.tempProfile._id}`)
        .send(updateData)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with bad token and valid Profile id', function() {

      before( done => mockProfile.call(this, done));

      it('should return a 400 for bad request', (done) => {
        let updateData = {
          firstName: 'Scout',
        };

        request.put(`${url}/api/profile/${this.tempProfile._id}`)
        .send(updateData)
        .set({
          Authorization: `Bearer `,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with wrong token', function() {
      let tempSecondUser = {};

      before( done => mockProfile.call(this, done));
      before( done => mockUser.call(tempSecondUser, done));

      it('should return a 401 for unauthorized access', (done) => {
        let updateData = {
          firstName: 'Scout',
        };

        request.put(`${url}/api/profile/${this.tempProfile._id}`)
        .send(updateData)
        .set({
          Authorization: `Bearer ${tempSecondUser.tempToken}`,
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });

  describe('testing DELETE /api/profile/:profileID', function() {

    describe('deleting a profile', function() {

      before( done => mockProfile.call(this, done));

      it('should return a 204 status, successful deletion', (done) => {

        request.delete(`${url}/api/profile/${this.tempProfile._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(204);
          done();
        });
      });
    });

    describe('with valid token and invalid id', function() {

      before( done => mockProfile.call(this, done));

      it('should return a 404, profile not found', (done) => {

        request.delete(`${url}/api/profile/:profileID`)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    describe('with bad token request and valid id', function() {

      before( done => mockProfile.call(this, done));

      it('should return a 400, bad request', (done) => {

        request.delete(`${url}/api/profile/${this.tempProfile._id}`)
        .set({
          Authorization: `Bearer `,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with wrong token', function() {
      let tempSecondUser = {};

      before( done => mockProfile.call(this, done));
      before( done => mockUser.call(tempSecondUser, done));

      it('should return a 401 for unauthorized user', (done) => {

        request.delete(`${url}/api/profile/${this.tempProfile._id}`)
        .set({
          Authorization: `Bearer ${tempSecondUser.tempToken}`,
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });


  });
});
