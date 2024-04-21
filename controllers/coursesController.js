const fs = require("fs");

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/courses.json`)
);

exports.checkID = (req, res, next, val) => {
  console.log(`Course id is: ${val}`);
  if (req.params.id * 1 > courses.length) {
    return res.status(404).json({
      //return is important, do not want to run the code after the response.
      status: "fail",
      message: "Invalid ID",
    });
  }
  next();
};

exports.getAllCourses = (req, res) => {
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: courses.length,
    data: {
      courses,
    },
  });
};

exports.getCourse = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;
  const course = courses.find((el) => el._id === id);

  res.status(200).json({
    status: "success",
    data: {
      course,
    },
  });
};

exports.createCourse = (req, res) => {
  const newId = courses[courses.length - 1]._id + 1;
  const newCourse = Object.assign({ _id: newId }, req.body);

  courses.push(newCourse);

  fs.writeFile(
    `${__dirname}/data/courses.json`,
    JSON.stringify(courses),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          course: newCourse,
        },
      });
    }
  );
};

exports.updateCourse = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      course: "<Updated Course>",
    },
  });
};

exports.deleteCourse = (req, res) => {
  res.status(204).json({
    status: "success",
    data: null,
  });
};
