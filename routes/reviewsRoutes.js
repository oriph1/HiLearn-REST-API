const express = require('express');

const reviewsController = require('../controllers/reviewsController');
const authController = require('../controllers/authController');
const usersController = require('../controllers/usersController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(reviewsController.getAllReviews)
  .post(usersController.getUserByEmail, reviewsController.createReview);

// router.use(authController.restrictTo('admin'));
router
  .route('/:id')
  .delete(reviewsController.checkauthorOfReview, reviewsController.deleteReview)
  .patch(reviewsController.checkauthorOfReview, reviewsController.updateReview)
  .get(reviewsController.getReview);

module.exports = router;
