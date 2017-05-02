'use strict';

const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: {type: String, unique: true, required: true},
  phone: {type: String, unique: true},
  username: {type: String, unique: true},
  currentLikes: {type: Number},
  likeRate: {type: Number},
  // charities: [{}] Need to figure out where database of charities/non-profits is coming from first.
  // lastDonation: {type: String}, <-- seems redundant.
  pastDonations: [{
    amount: {type: Number},
    organization: {type: String},
  }],
  // I want to make the pastDonation property an array with which new donations can be added to. Being able to grab the entire donation history could be useful down the road.
  userID: {type: mongoose.Schema.Types.ObjectId, required: true},
});

module.exports = mongoose.model('profile', profileSchema);
