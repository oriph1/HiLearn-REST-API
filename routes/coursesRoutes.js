const express = require('express');

const coursesController = require('../controllers/coursesController');

const router = express.Router();

router.param('id', coursesController.checkID);

router
  .route('/')
  .get(coursesController.getAllCourses)
  .post(coursesController.checkBody, coursesController.createCourse);

router
  .route('/:id')
  .get(coursesController.getCourse)
  .patch(coursesController.updateCourse)
  .delete(coursesController.deleteCourse);

module.exports = router;
