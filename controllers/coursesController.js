const Course = require('../models/coursesModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getCourseBySlug = catchAsync(async (req, res, next) => {
  // const course = await Course.find(req.params.slug);
  const course = await Course.findOne({ slug: req.params.slug }).populate({
    path: 'teachers',
    select: 'name email description ratingsAverage ratingsQuantity',
  });
  if (!course) {
    return next(new AppError('No course found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      course,
    },
  });
});

exports.getCourse = factory.getOne(Course, {
  path: 'teachers',
  select: 'name email description ratingsAverage ratingsQuantity',
});

exports.getAllCourses = factory.getAll(Course, {
  path: 'teachers',
  select: 'name email description',
});

//Methods only for admins
exports.deleteCourse = factory.deleteOne(Course);
exports.createCourse = factory.createOne(Course);
exports.updateCourse = factory.updateOne(Course, {
  path: 'teachers',
  select: 'name email description ratingsAverage ratingsQuantity',
});
