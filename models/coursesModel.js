const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseNumber: {
    type: String,
    required: [true, 'A course most contain a course number'],
    unique: true,
    trim: true,
  },
  nameOfCourse: {
    type: String,
    required: [true, 'A course most contain a name'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  Teachers: [String],
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
