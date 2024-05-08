const Course = require('../models/coursesModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllCourses = catchAsync(async (req, res, next) => {
  //EXECUTE QUERY
  const features = new APIFeatures(Course.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const courses = await features.query.populate({
    path: 'teachers',
    select: 'name email description',
  });

  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: courses.length,
    data: {
      courses,
    },
  });
});

exports.getCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'teachers',
    select: 'name email description',
  });
  // const course = await Course.findOne({ courseNumber: req.params.id });
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

exports.getCourseBySlug = catchAsync(async (req, res, next) => {
  // const course = await Course.find(req.params.slug);
  const course = await Course.findOne({ slug: req.params.slug }).populate({
    path: 'teachers',
    select: 'name email description',
  });
  res.status(200).json({
    status: 'success',
    data: {
      course,
    },
  });
});

exports.createCourse = catchAsync(async (req, res, next) => {
  const newCourse = await Course.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      course: newCourse,
    },
  });
});

exports.updateCourse = catchAsync(async (req, res, next) => {
  //Here we will need to find the course, and then delete a specific teacher from it or add a new teacher to it
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate({
    path: 'teachers',
    select: 'name email description',
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

exports.deleteCourse = catchAsync(async (req, res, next) => {
  //Here we will need to find the course by the course number ans delete it and also delete in in all the teachers of this course
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) {
    return next(new AppError('No course found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
