const express = require('express');
const usersController = require('../controllers/usersController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);

router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword,
);

router.patch('/updateMe', authController.protect, usersController.updateMe);
router.delete('/deleteMe', authController.protect, usersController.deleteMe);

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    usersController.getAllUsers,
  )
  .post(usersController.createUser);

router
  .route('/:id')
  .get(authController.protect, usersController.getUser)
  .patch(authController.protect, usersController.updateUser)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    usersController.deleteUser,
  );

module.exports = router;
