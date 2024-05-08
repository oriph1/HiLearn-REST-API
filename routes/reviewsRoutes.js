const express = require('express');

const reviewsController = require('../controllers/reviewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, reviewsController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('student'),
    reviewsController.createReview,
  );

module.exports = router;
