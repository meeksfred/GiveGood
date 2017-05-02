'use strict';

// npm modules
const expect = require('chai').expect;
const request = require('superagent');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const validator = require('validator');

// app modules
const serverCtrl = require('./lib/server-control.js');
const cleanDB = require('./lib/clean-db.js');
const mockUser = require('./lib/user-mock.js');

mongoose.Promise = Promise;

// module constants
const server = require('../server.js');
const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'helloWorld',
  password: 'password',
  email: 'test@test.com',
};

describe('testing user-router', function() {

  before( done => serverCtrl.serverUp(server, done));

  after( done => serverCtrl.serverDown(server, done));

  afterEach( done => cleanDB(done));

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

    describe('with no username', function() {

      it('should return a 400 error, bad request', (done) => {

        request.post(`${url}/api/signup`)
        .send({
          password: exampleUser.password,
          email: exampleUser.email,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('BadRequestError');
          done();
        });
      });
    });

    describe('with no password', function() {

      it('should return a 400 error, bad request', (done) => {

        request.post(`${url}/api/signup`)
        .send({
          username: exampleUser.username,
          email: exampleUser.email,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('BadRequestError');
          done();
        });
      });
    });

    describe('with no email', function() {

      it('should return a 400 error, bad request', (done) => {

        request.post(`${url}/api/signup`)
        .send({
          username: exampleUser.username,
          password: exampleUser.password,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('BadRequestError');
          done();
        });
      });
    });

    describe('with duplicate username', function() {

      before( done => mockUser.call(this, done));

      it('should return a 409 error, duplicate conflict', (done) => {

        request.post(`${url}/api/signup`)
        .send({
          username: this.tempUser.username,
          password: exampleUser.password,
          email: exampleUser.email,
        })
        .end((err, res) => {
          expect(res.status).to.equal(409);
          expect(res.text).to.equal('ConflictError');
          done();
        });
      });
    });

    describe('with duplicate email', function() {

      before( done => mockUser.call(this, done));

      it('should return a 409 error, duplicate conflict', (done) => {

        request.post(`${url}/api/signup`)
        .send({
          username: exampleUser.username,
          password: exampleUser.password,
          email: this.tempUser.email,
        })
        .end((err, res) => {
          expect(res.status).to.equal(409);
          expect(res.text).to.equal('ConflictError');
          done();
        });
      });
    });

    describe('with username < 3 characters', function() {

      it('should return a 400 error, bad request/username too short', (done) => {

        request.post(`${url}/api/signup`)
        .send({
          username: 'no',
          password: exampleUser.password,
          email: exampleUser.email,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with password < 7 characters', function() {

      it('should return a 400 error, bad request/password too short', (done) => {

        request.post(`${url}/api/signup`)
        .send({
          username: exampleUser.username,
          password: 'test',
          email: exampleUser.email,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('BadRequestError');
          done();
        });
      });
    });

    describe('with invalid endpoint', function() {

      it('should return a 404 error, endpoint not found', (done) => {

        request.post(`${url}/api/badsignup`)
        .send({
          username: exampleUser.username,
          password: exampleUser.password,
          email: exampleUser.email,
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });

  describe('testing GET /api/login', function() {

    describe('with a valid login/authorization', function() {

      before( done => mockUser.call(this, done));

      it('should return a token and 200 status', (done) => {
        request.get(`${url}/api/login`)
        .auth(this.tempUser.username, this.tempPassword)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
      });
    });

    describe('with invalid username', function() {

      before( done => mockUser.call(this, done));

      it('should return a 401 status, unauthorized', (done) => {
        request.get(`${url}/api/login`)
        .auth('notusername', this.tempPassword)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.text).to.equal('UnauthorizedError');
          done();
        });
      });
    });

    describe('with invalid password', function() {

      before( done => mockUser.call(this, done));

      it('should return a 401 status, unauthorized', (done) => {
        request.get(`${url}/api/login`)
        .auth(this.tempUser.username, 'notpassword')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.text).to.equal('UnauthorizedError');
          done();
        });
      });
    });

    describe('with invalid endpoint', function() {

      before( done => mockUser.call(this, done));

      it('should return a 404 status, endpoint not found', (done) => {
        request.get(`${url}/api/notlogin`)
        .auth(this.tempUser.username, this.tempPassword)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });

  // NEED TO MAKE A DIFFERENT MODEL, ie.. PROFILE or ACCOUNT (something separate from USER because I don't want to be returning to the client the password and findHASH, Bad bad bad).

  // describe('testing GET /api/user', function() {
  //
  //   describe('with a valid request', function() {
  //
  //     before( done => mockUser.call(this, done));
  //
  //     it('should return with a 200 status, and user data', (done) => {
  //       request.get(`${url}/api/user`)
  //       .set({
  //         Authorization: `Bearer ${this.tempToken}`,
  //       })
  //       .end((err, res) => {
  //         if (err) return done(err);
  //         console.log(res.body, 'res.body');
  //         expect(res.status).to.equal(200);
  //         expect(res.body.username).to.equal(this.tempUser.username);
  //         expect(res.body.email).to.equal(this.tempUser.email);
  //         done();
  //       });
  //     });
  //   });
  //
  //
  // });

  describe('testing DELETE /api/deleteAccount', function() {

    describe('with valid user credentials', function() {

      before( done => mockUser.call(this, done));

      it('should return a 204 status, successful deletion', (done) => {
        request.delete(`${url}/api/deleteAccount/${this.tempUser._id}`)
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

    describe('with bad token request', function() {

      before( done => mockUser.call(this, done));

      it('should return a 400 status, bad request', (done) => {
        request.delete(`${url}/api/deleteAccount/${this.tempUser._id}`)
        .set({
          Authorization: `Bear `,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('BadRequestError');
          done();
        });
      });
    });

    describe('with unauthorized request', function() {

      let secondTemp = {};
      before( done => mockUser.call(this, done));
      before( done => mockUser.call(secondTemp, done));

      it('should return a 401 status, unauthorized request', (done) => {
        request.delete(`${url}/api/deleteAccount/${this.tempUser._id}`)
        .set({
          Authorization: `Bearer ${secondTemp.tempToken}`,
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.text).to.equal('UnauthorizedError');
          done();
        });
      });
    });

    describe('with invalid endpoint/user not found', function() {

      before( done => mockUser.call(this, done));

      it('should return a 404 status, not found', (done) => {
        request.delete(`${url}/api/deleteAccount/thisisfake`)
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

  // describe()...
});
