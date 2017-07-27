'use strict';

// npm modules
const express = require('express');
const morgan = require('morgan');
const Promise = require('bluebird');
const cors = require('cors');
const mongoose = require('mongoose');
const debug = require('debug')('givegood:server');
const dotenv = require('dotenv');

const userRouter = require('./route/user-router.js');
const profileRouter = require('./route/profile-router.js');

const errorMiddleware = require('./lib/error-middleware.js');

dotenv.load({path: `${__dirname}/.env`});

// Connect to MongoDB
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI, {
  useMongoClient: true,
});

// Module constants
const PORT = process.env.PORT || 3000;
const app = express();

// app middleware
app.use(cors());
app.use(morgan('dev'));

// app routes
app.use(express.static(`${__dirname}/build`));
app.use(userRouter);
app.use(profileRouter);
app.use(errorMiddleware);

// start server
const server = module.exports = app.listen(PORT, () => {
  debug('server started');
  console.log('server up');
});

server.isRunning = true;
