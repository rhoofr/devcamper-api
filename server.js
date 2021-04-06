const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const fileupload = require('express-fileupload');
const morgan = require('morgan');
const moment = require('moment-timezone');
const cookieParser = require('cookie-parser');
const { getCurrentDateTimeLocal } = require('./utils/datetime');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

const app = express();

// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
// const auth = require('./routes/auth');
// const users = require('./routes/users');
// const reviews = require('./routes/reviews');

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Development logging
if (process.env.NODE_ENV === 'development') {
  morgan.token('date', (req, res, tz) => {
    return moment().tz(tz).format('MM-DD-YYYY HH:mm:ss a');
  });
  morgan.format(
    'myformat',
    ':date[America/New_York] - Method=:method - URL=:url - Status=:status - ContentLength=:res[content-length] - ResponseTime=:response-time ms - UserAgent=:user-agent'
  );

  app.use(morgan('myformat'));
}

// File uploading
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

// Set up error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${
      process.env.NODE_ENV
    } mode on port ${PORT}. Current Date/Time: ${getCurrentDateTimeLocal()}`
      .yellow.bold
  );
});

// Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server and exit process
  server.close(() => {
    process.exit(1);
  });
});
