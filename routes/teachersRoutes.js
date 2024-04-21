const express = require("express");
const teachersController = require("./../controllers/teachersController");
const router = express.Router();

router
  .route("/")
  .get(teachersController.getAllTeachers)
  .post(teachersController.createTeacher);

router
  .route("/:id")
  .get(teachersController.getTeacher)
  .patch(teachersController.updateTeacher)
  .delete(teachersController.deleteTeacher);

module.exports = router;
