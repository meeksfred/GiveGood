'use strict';

const createError = require('http-errors');
const debug = require('debug')('givegood:error-middleware');

module.exports = function(err, req, res, next) {
  debug();
  console.error(err);
  console.error('name', err.name);

  if(err.status){
    res.status(err.status).send(err.name);
    next();
    return;
  }

  if(err.name === 'ValidationError'){
    err = createError(400, err.message);
    res.status(err.status).send(err.name);
    next();
    return;
  }

  if(err.name === 'MongoError' && err.message.includes('E11000 duplicate')){
    err = createError(409, err.message);
    res.status(err.status).send(err.name);
    next();
    return;
  }

  err = createError(500, err.message);
  res.status(err.status).send(err.name);
  next();
};
