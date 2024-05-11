const express = require('express');
const usersController = require('../controllers/usersController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewsRoutes');

const router = express.Router();

router.use('/reviews', reviewRouter);
router.use('/:userId/reviews', reviewRouter);

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);

router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', usersController.getMe, usersController.getUser);

router.patch('/updateMe', usersController.updateMe);
router.delete('/deleteMe', usersController.deleteMe);

router.route('/').get(usersController.getAllUsers);

router.use(authController.restrictTo('admin'));
router
  .route('/:id')
  .get(usersController.getUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = router;
