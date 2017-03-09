'use strict';

// npm modules
const expect = require('chai').expect;
// const request = require('superagent');
// const Promise = require('bluebird');
// const mongoose = require('mongoose');

// app modules
const serverCtrl = require('./lib/server-control.js');

// module constants
const server = require('../server.js');
// const url = `http://localhost:${process.env.PORT}`;

describe('testing user-router', function() {

  before( done => serverCtrl.serverUp(server, done));

  after( done => serverCtrl.serverDown(server, done));

  describe('sample test', () => {

    it('should pass', () => {
      expect(true).to.equal(true);
    });
  });
});
