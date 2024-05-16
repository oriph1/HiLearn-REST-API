const User = require('../models/usersModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const aidFunctions = require('../utils/aidFunctions');
const Course = require('../models/coursesModel');
const factory = require('./handlerFactory');

exports.sendUser = catchAsync(async (req, res, next) => {
  res.status(400).json({
    status: 'success',
    user: req.userToFind,
  });
});

exports.getUserByEmail = catchAsync(async (req, res, next) => {
  if (!req.body.email) {
    return next(new AppError('Please add an email to the request.', 404));
  }
  const userToFind = await User.findOne({ email: req.body.email })
    .populate('ReviewsOnMe')
    .populate('ReviewsIGave');
  if (!userToFind) {
    return next(
      new AppError('No user exist with that email. please try again.', 404),
    );
  }
  req.userToFind = userToFind;
  next();
});

const findCourses = async (courses) => {
  const promises = courses.map(async (el) => {
    const course = await Course.findOne({ fullCourseNumber: el });
    if (!course) return 'Not found';
    return course._id;
  });
  return await Promise.all(promises);
};

exports.findCoursesForUser = async (courses) => {
  let results = await findCourses(courses);

  //filter the not found
  results = results.filter((el) => el !== 'Not found');

  //Remove duplicates
  return aidFunctions.removeDuplicates(results);
};

const filterObj = async (obj, courses, ...allowedFileds) => {
  let newObj = {};

  newObj['courses'] = courses;
  for (const el of Object.keys(obj)) {
    if (allowedFileds.includes(el)) {
      newObj[el] = obj[el];
      if (el === 'coursesToAdd') {
        //Find the courses from the list
        obj[el] = await exports.findCoursesForUser(obj[el]);

        //Add the courses to the user courses list
        const nextCourses = aidFunctions.removeDuplicates(
          newObj['courses'].concat(obj[el]),
        );
        newObj['courses'] = nextCourses;
      }
      if (el === 'coursesToRemove') {
        obj[el] = await exports.findCoursesForUser(obj[el]);
        newObj['courses'] = newObj['courses'].filter(
          (element) => !obj[el].includes(String(element)),
        );
      }
    }
  }
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /UpdateMyPassword.',
        400,
      ),
    );
  }
  let filteredBody;
  //2)Filtered out unwanted fields names that are not allowed to be updated
  if (req.user.role != 'student') {
    filteredBody = await filterObj(
      req.body,
      req.user.courses,
      'name',
      'email',
      'coursesToAdd',
      'coursesToRemove',
    );
  } else {
    filteredBody = await filterObj(req.body, req.user.courses, 'name', 'email');
  }
  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  }).populate({
    path: 'courses',
    select: 'fullCourseNumber nameOfCourse _id',
  });

  res.status(400).json({
    status: 'success',
    data: {
      updatedUser,
    },
  });
});
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getAllUsers = factory.getAll(User, {
  path: 'courses',
  select: 'fullCourseNumber nameOfCourse _id',
});

exports.getUser = factory.getOne(User, {
  path: 'courses',
  select: 'fullCourseNumber nameOfCourse _id',
});

//Methods only for admins
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
