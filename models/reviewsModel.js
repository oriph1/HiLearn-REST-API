const mongoose = require('mongoose');

const validator = require('validator');

const User = require('./usersModel');

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    //Who is rating
    ratingUser: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },

    //Who is rated
    ratedUser: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must be on another user'],
    },
  },
  {
    //when calling this methods the virtual properties will be added
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
