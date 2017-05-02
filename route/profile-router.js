'use strict';

const Router = require('express').Router;
const debug = require('debug')('givegood:profile-router');
const jsonParser = require('body-parser').json();
const createError = require('http-errors');

const User = require('../model/user.js');
const Profile = require('../model/profile.js');

const bearerAuth = require('../lib/bearer-auth-middleware.js');

const profileRouter = module.exports = Router();

profileRouter.post('/api/profile', bearerAuth, jsonParser, (req, res, next) => {
  debug('hit route POST /api/profile');
  req.body.userID = req.user._id;
  User.findById(req.user._id)
  .then( user => {
    req.body.username = user.username;
    req.body.email = user.email;
    return new Profile(req.body).save();
  })
  .then( profile => res.json(profile))
  .catch(next);
});
