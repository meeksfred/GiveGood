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

profileRouter.get('/api/profile/me', bearerAuth, (req, res, next) => {
  debug('hit route GET /api/profile/me');

  Profile.findOne({userID: req.user._id})
  .then( profile => {
    if (!profile) return Promise.reject(createError(404, 'User hasn\'t created a profile yet'));
    res.json(profile);
  })
  .catch(next);
});

profileRouter.put('/api/profile/:profileID', bearerAuth, jsonParser, (req, res, next) => {
  debug('hit route PUT /api/profile/:profileID');

  Profile.findById(req.params.profileID)
  .catch( err => Promise.reject(createError(404, err.message)))
  .then( profile => {
    if ( profile.userID.toString() !== req.user._id.toString()) {
      return Promise.reject(createError(401, 'unauthorized user'));
    }
    return Profile.findByIdAndUpdate(req.params.profileID, req.body, {new: true, runValidators: true});
  })
  .then( profile => {
    let updateData = {
      username: profile.username,
      email: profile.email,
    };
    console.log('do I hit????');
    return User.findByIdAndUpdate(profile.userID, updateData, {new: true, runValidators: true});
    // NOT UPDATING USER, might not be possible
  })
  .then( () => {
    Profile.findById(req.params.profileID)
    .then( profile => res.json(profile));
  })
  .catch(next);
});
