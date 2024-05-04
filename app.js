const express = require('express');
const morgan = require('morgan');

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const coursesRouter = require('./routes/coursesRoutes');
const usersRouter = require('./routes/usersRoutes');

const app = express();

//1) Middlewares

//Set security HTTP headers
app.use(helmet());

//Getting details about the request
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 100,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

//Body parser, reading data from the body int req.body
app.use(express.json({ limit: '10kb' }));

//Data sanitization agians noSQL injection
app.use(mongoSanitize());

//Data sanitizaion against XSS
app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['rule', 'ratingsAverage', 'fullCourseNumber'],
  }),
);

//Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//3) Routes
app.use('/api/v1/courses', coursesRouter);
app.use('/api/v1/users', usersRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
