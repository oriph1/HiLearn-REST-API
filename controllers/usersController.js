const User = require('../models/usersModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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

const filterObj = (obj, courses, ...allowedFileds) => {
  const newObj = {};
  newObj['courses'] = courses;
  Object.keys(obj).forEach((el) => {
    if (allowedFileds.includes(el)) {
      newObj[el] = obj[el];
      if (el === 'coursesToAdd') {
        obj[el].forEach((item) => {
          if (!newObj['courses'].includes(item)) {
            newObj['courses'].push(item);
          }
        });
      }
      if (el === 'coursesToRemove') {
        console.log(obj[el]);
        console.log(newObj['courses']);
        newObj['courses'] = newObj['courses'].filter(
          (item) => !obj[el].includes(item),
        );
        console.log(newObj['courses']);
      }
    }
  });
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
  //2)Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    req.user.courses,
    'name',
    'email',
    'coursesToAdd',
    'coursesToRemove',
  );
  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  // await user.save();

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
