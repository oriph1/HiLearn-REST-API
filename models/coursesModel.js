const mongoose = require('mongoose');

const slugify = require('slugify');

const courseSchema = new mongoose.Schema(
  {
    fullCourseNumber: {
      type: String,
      required: [true, 'A course most contain a full course number.'],
      unique: true,
      trim: true,
      validate: {
        validator: function (val) {
          //This only points to current doc on New document creation
          const parts = val.split('.');

          //The number does not contatins 2 .
          if (parts.length !== 3) {
            return false;
          }
          //Check that the number is not in the right length
          if (
            parts[0].length !== 3 ||
            (parts[1] !== '1' && parts[1] !== '2') ||
            parts[2].length !== 4
          ) {
            return false;
          }
          //Check that the number contains only numbers
          if (!/^\d+$/.test(parts[0]) || !/^\d+$/.test(parts[2])) {
            return false;
          }
          return true;
        },
        message:
          'Illegal course number ({VALUE}). Try again with the right format. for example 202.1.2033',
      },
    },
    department: {
      type: String,
    },
    typeOfDegree: {
      type: String,
    },
    courseId: {
      type: String,
    },
    slug: {
      type: String,
    },
    nameOfCourse: {
      type: String,
      required: [true, 'A course most contain a name'],
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        delete ret.id;
      },
    },
    toObject: { virtuals: true },
  },
);

courseSchema.virtual('teachers', {
  ref: 'User',
  foreignField: 'courses',
  localField: '_id',
});

courseSchema.index({ slug: 1 });

courseSchema.pre('save', function (next) {
  const parts = this.fullCourseNumber.split('.');
  this.slug = slugify(parts.join(' '));
  this.department = parts[0];
  this.typeOfDegree = parts[1];
  this.courseId = parts[2];

  next();
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
