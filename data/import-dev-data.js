const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Course = require('../models/coursesModel');
//Needs to happen only onces
dotenv.config({ path: './config.env' });

//Replace the password
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
//connect
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful'));

//READ JSON FILE
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/courses.json`, 'utf-8'),
);

//IMPROT DATA INTO DB
const importData = async () => {
  try {
    await Course.create(courses);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//DELETE ALL DATA FROM COLLECTION
const deleteData = async () => {
  try {
    await Course.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
