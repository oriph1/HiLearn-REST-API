const crypto = require('crypto');

const mongoose = require('mongoose');

const validator = require('validator');

const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A user most contain a name.'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'A user most contain a phone number.'],
      unique: true,
    },
    role: {
      type: String,
      enum: ['student', 'teacher', 'admin'],
      default: 'student',
    },
    password: {
      type: String,
      required: [
        function () {
          return this.isModified('password') || this.isNew;
        },
        'A user must contain a password.',
      ],
      // minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [
        function () {
          return this.isModified('password') || this.isNew;
        },
        'A user must contain a password confirm.',
      ],
      validate: {
        //This only work on CREATE SAVE!!!
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!',
      },
    },
    email: {
      type: String,
      required: [true, 'A user most contain an email.'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    description: {
      type: String,
    },
    courses: [{ type: mongoose.Schema.ObjectId, ref: 'Course' }],
    ratingsAverage: {
      type: Number,
      default: 4,
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    passwordChangedAt: {
      type: Date,
      select: false,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
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

//Virtual popluate of the reviews wirtten on me
userSchema.virtual('ReviewsOnMe', {
  ref: 'Review',
  foreignField: 'ratedTeacher',
  localField: '_id',
});

//Virtual popluate for the reviews given by me
userSchema.virtual('ReviewsIGave', {
  ref: 'Review',
  foreignField: 'ratingStudent',
  localField: '_id',
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre('save', async function (next) {
  // Only run this fucntion if password was actially modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //Delte passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre(/^find/, function (next) {
  //this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    console.log(changedTimeStamp, JWTTimestamp);
    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
