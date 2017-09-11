'use strict';

const Router = require('express').Router;
const debug = require('debug')('givegood:profile-router');
const jsonParser = require('body-parser').json();
const createError = require('http-errors');

const User = require('../model/user.js');
const Profile = require('../model/profile.js');

const bearerAuth = require('../lib/bearer-auth-middleware.js');
const facebookOAUTH = require('../lib/facebook-oauth-middleware.js');

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
  .catch( next );
});

profileRouter.get('/api/profile/me', bearerAuth, (req, res, next) => {
  debug('hit route GET /api/profile/me');

  Profile.findOne({userID: req.user._id})
  .then( profile => {
    if (!profile) return Promise.reject(createError(404, 'User hasn\'t created a profile yet'));
    res.json(profile);
  })
  .catch( next );
});

// Updates both Profile and associated User models (only username and email for User)
profileRouter.put('/api/profile/:profileID', bearerAuth, jsonParser, (req, res, next) => {
  debug('hit route PUT /api/profile/:profileID');

  Profile.findById(req.params.profileID)
  .catch( err => Promise.reject(createError(404, err.message)))
  .then( profile => {
    if (profile.userID.toString() !== req.user._id.toString()) {
      return Promise.reject(createError(401, 'unauthorized user'));
    }
    if (req.body.username && req.body.email) {
      let updateData = {
        username: req.body.username,
        email: req.body.email,
      };
      return User.findByIdAndUpdate(profile.userID, updateData, {new: true, runValidators: true});
    }
  })
  .then( user => {
    console.log('USER', user);
    return Profile.findByIdAndUpdate(req.params.profileID, req.body, {new: true, runValidators: true});
  })
  .then( profile => res.json(profile))
  .catch( next );
});

profileRouter.put('/api/profile/social/:profileID', bearerAuth, jsonParser, (req, res, next) => {
  debug('hit route PUT /api/profile/social');

  Profile.findById(req.params.profileID)
  .catch( err => Promise.reject(createError(404, err.message)))
  .then( profile => {
    if (profile.userID.toString() !== req.user._id.toString()) {
      return Promise.reject(createError(401, 'unauthorized user'));
    }
    return Profile.findByIdAndUpdate(req.params.profileID, req.body, {new: true, runValidators: true});
  })
  .then( profile => {
    console.log(profile, 'updated???');
    res.json(profile);
  })
  .catch( next );
});

profileRouter.delete('/api/profile/:profileID', bearerAuth, (req, res, next) => {
  debug('hit route DELETE /api/profile/:profileID');

  Profile.findById(req.params.profileID)
  .catch( err => Promise.reject(createError(404, err.message)))
  .then( profile => {
    if (profile.userID.toString() !== req.user._id.toString()) {
      return Promise.reject(createError(401, 'unauthorized user'));
    }
    return Profile.findByIdAndRemove(req.params.profileID);
  })
  .then( () => res.sendStatus(204))
  .catch( next );
});

profileRouter.get('/api/auth/facebook_oauth_callback', facebookOAUTH, (req, res) => {
  debug('hit route GET /api/auth/facebook_oauth_callback');

  // if (req.facebookError) return res.redirect('/#/home');

  console.log(req.facebookOAUTH, 'made it to route');

  Profile.findOne({ lastName: req.facebookOAUTH.lastName })
  .then( profile => {
    console.log(profile, 'PROFILE???');
    let fbData = {
      facebook: {
        facebookID: req.facebookOAUTH.facebookID,
        accessToken: req.facebookOAUTH.accessToken,
        likes: req.facebookOAUTH.likes,
        tokenTTL: req.facebookOAUTH.tokenTTL,
        tokenTimeStamp: Date.now(),
      },
    };
    return Profile.findByIdAndUpdate(profile.profileID, fbData, {new: true, runValidators: true});
  })
  .then( profile => {
    console.log(profile, 'profileAfter');
    res.send(profile);
  })
  .catch( err => {
    console.error(err);
  });
});
