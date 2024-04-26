const express = require('express');

const coursesController = require('../controllers/coursesController');

const router = express.Router();

// router.param('id', coursesController.checkID);
//get course by his slug
router.route('/slug/:slug').get(coursesController.getCourseBySlug);

router
  .route('/')
  .get(coursesController.getAllCourses)
  .post(coursesController.createCourse);

router
  .route('/:id')
  .get(coursesController.getCourse)
  .patch(coursesController.updateCourse)
  .delete(coursesController.deleteCourse);

module.exports = router;
