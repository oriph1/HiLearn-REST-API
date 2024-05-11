const express = require('express');

const coursesController = require('../controllers/coursesController');
const authController = require('../controllers/authController');

const router = express.Router();

//get course by his slug for example: 201-1-2088
router
  .route('/slug/:slug')
  .get(authController.protect, coursesController.getCourseBySlug);

router.use(authController.protect);
router
  .route('/')
  .get(coursesController.getAllCourses)
  .post(authController.restrictTo('admin'), coursesController.createCourse);

router
  .route('/:id')
  .get(coursesController.getCourse)
  .patch(authController.restrictTo('admin'), coursesController.updateCourse)
  .delete(authController.restrictTo('admin'), coursesController.deleteCourse);

module.exports = router;
