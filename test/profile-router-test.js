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
          console.log(res.body, 'res.body');
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

    // Why is the email the one that always gets flagged for duplicates.

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
          console.log(exampleProfile.email, 'ex email');
          console.log(this.tempProfile.email, 'lorem email');
          console.log(res.text, 'res.text');
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
          console.log(exampleProfile.email, 'ex email');
          console.log(this.tempProfile.email, 'lorem email');
          console.log(res.text, 'res.text');
          done();
        });
      });
    });


  });
});
