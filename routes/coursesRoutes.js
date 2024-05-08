const express = require('express');

const coursesController = require('../controllers/coursesController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.param('id', coursesController.checkID);
//get course by his slug
router
  .route('/slug/:slug')
  .get(authController.protect, coursesController.getCourseBySlug);

router
  .route('/')
  .get(authController.protect, coursesController.getAllCourses)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    coursesController.createCourse,
  );

router
  .route('/:id')
  .get(authController.protect, coursesController.getCourse)
  .patch(authController.protect, coursesController.updateCourse)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    coursesController.deleteCourse,
  );

module.exports = router;
