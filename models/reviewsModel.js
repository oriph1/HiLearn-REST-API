const mongoose = require('mongoose');

const validator = require('validator');

const User = require('./usersModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
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
    ratingStudent: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },

    //Who is rated
    ratedTeacher: {
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

reviewSchema.index({ ratedTeacher: 1, ratingStudent: 1 }, { unique: true });
// reviewSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'ratingStudent',
//     select: 'name email',
//   }).populate({
//     path: 'ratedTeacher',
//     select: 'name email',
//   });
// });

reviewSchema.statics.calcAverageRatings = async function (userId) {
  const stats = await this.aggregate([
    {
      $match: { ratedTeacher: userId },
    },
    {
      $group: {
        _id: '$ratedTeacher',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length === 0) {
    await User.findByIdAndUpdate(userId, {
      ratingsQuantity: 0,
      ratingsAverage: 4,
    });
  } else {
    await User.findByIdAndUpdate(userId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  }
};

reviewSchema.post('save', function () {
  //this points to current review
  this.constructor.calcAverageRatings(this.ratedTeacher);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.ratedTeacher);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
