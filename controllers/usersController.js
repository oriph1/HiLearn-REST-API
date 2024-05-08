const User = require('../models/usersModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const Course = require('../models/coursesModel');

const removeDuplicates = (courses) => {
  const unique = [];
  courses.forEach((element) => {
    const strElement = String(element); // Convert element to string
    if (!unique.includes(strElement)) {
      unique.push(strElement);
    }
  });
  return unique;
};

const findCourses = async (courses) => {
  const promises = courses.map(async (el) => {
    const course = await Course.findOne({ fullCourseNumber: el }); // Changed find to findOne
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
  return removeDuplicates(results);
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

const filterObj = async (obj, courses, ...allowedFileds) => {
  let newObj = {};

  newObj['courses'] = courses;
  for (const el of Object.keys(obj)) {
    if (allowedFileds.includes(el)) {
      newObj[el] = obj[el];
      if (el === 'coursesToAdd') {
        //Find the courses from the list
        obj[el] = await exports.findCoursesForUser(obj[el]);
        // console.log(obj[el]);

        //Add the courses to the user courses list
        const nextCourses = removeDuplicates(newObj['courses'].concat(obj[el]));
        newObj['courses'] = nextCourses;
        console.log('first print');
        console.log(newObj['courses']);
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

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
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
    date: {
      updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defiend',
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defiend',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defiend',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defiend',
  });
};
