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

  if(password.length < 7)
    return next(createError(400, 'password must be at least 7 characters'));

  user.generatePasswordHash(password)
  .then(user => user.save())
  .then(user => user.generateToken())
  .then(token => res.send(token))
  .catch(next);
});
