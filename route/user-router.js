'use strict';

const Router = require('express').Router;
const debug = require('debug')('givegood:user-router');
const jsonParser = require('body-parser').json();
const createError = require('http-errors');

const User = require('../model/user.js');

const basicAuth = require('../lib/basic-auth-middleware.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const userRouter = module.exports = Router();

userRouter.post('/api/signup', jsonParser, (req, res, next) => {
  debug('hit route POST /api/signup');
  let password = req.body.password;
  delete req.body.password;
  let user = new User(req.body);

  if(!password)
    return next(createError(400, 'requires password'));

  if(req.body.username < 3)
    return next(createError(400, 'username must be at least 3 characters'));

  if(password.length < 7)
    return next(createError(400, 'password must be at least 7 characters'));

  user.generatePasswordHash(password)
  .then(user => user.save())
  .then(user => user.generateToken())
  .then(token => res.send(token))
  .catch(next);
});

userRouter.get('/api/login', basicAuth, (req, res, next) => {
  debug('hit route GET /api/login');

  User.findOne({username: req.auth.username})
  .then( user => user.comparePasswordHash(req.auth.password))
  .catch( err => Promise.reject(createError(401, err.message)))
  .then( user => user.generateToken())
  .then( token => res.send(token))
  .catch(next);
});

// This route will be changed, and be moved to the new model.

// userRouter.get('/api/user', bearerAuth, (req, res, next) => {
//   debug('hit route GET /api/user');
//
//   User.findById(req.user._id)
//   .catch( err => Promise.reject(createError(404, err.message)))
//   .then( user => res.json(user))
//   .catch(next);
// });


// Will need to rework this route a little bit because it will have to delete information from a new 'Profile' or 'Account' model.
userRouter.delete('/api/deleteAccount/:userID', bearerAuth, (req, res, next) => {
  debug('hit route DELETE /api/deleteAccount/:userID');

  User.findById(req.params.userID)
  .catch( err => Promise.reject(createError(404, err.message)))
  .then( user => {
    if(user.id.toString() !== req.user._id.toString()) {
      return Promise.reject(createError(401, 'unauthorized'));
    }
    return User.findByIdAndRemove(req.params.userID);
  })
  .catch( err => Promise.reject(err, err.message))
  .then( () => res.sendStatus(204))
  .catch(next);
});
