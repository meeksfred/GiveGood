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


// MAKE SURE TO MAKE A DB DELETE OPERATION ****************

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

    describe('with password < 7 characters', function() {

      it('should return a 400 error, bad request', (done) => {

        request.post(`${url}/api/signup`)
        .send({
          username: exampleUser.username,
          password: 'help',
          email: exampleUser.email,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('BadRequestError');
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

  });
});
