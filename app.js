const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const coursesRouter = require('./routes/coursesRoutes');
const usersRouter = require('./routes/usersRoutes');

const app = express();

//1) Middlewares

//Getting details about the request
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Neccessry for reading the body of the requests
app.use(express.json());

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
