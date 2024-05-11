const Review = require('../models/reviewsModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.checkauthorOfReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (req.user.role != 'admin') {
    console.log(review.ratingStudent);
    console.log(req.user._id);
    if (String(review.ratingStudent) != String(req.user._id)) {
      return next(
        new AppError(
          'You are not the author of the review. can not preform these actions.',
          404,
        ),
      );
    }
  }
  next();
});

exports.createReview = catchAsync(async (req, res, next) => {
  if (String(req.user._id) == String(req.userToFind._id)) {
    return next(new AppError('You can not rate yourself.', 404));
  }
  const newReview = await Review.create({
    rating: req.body.rating,
    ratingStudent: req.user._id,
    ratedTeacher: req.userToFind._id,
    review: req.body.review,
  });
  res.status(200).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});

exports.getAllReviews = factory.getAll(Review, {
  path: 'ratedTeacher',
  select: 'name email',
});
//Methods only for admins
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.getReview = factory.getOne(Review);
