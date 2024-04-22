const express = require("express");
const morgan = require("morgan");

const coursesRouter = require("./routes/coursesRoutes");
const teachersRouter = require("./routes/teachersRoutes");

const app = express();

//1) Middlewares

//Getting details about the request
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Neccessry for reading the body of the requests
app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//3) Routes
app.use("/api/v1/courses", coursesRouter);
app.use("/api/v1/teachers", teachersRouter);

module.exports = app;
