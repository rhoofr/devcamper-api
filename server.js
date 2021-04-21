const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const fileupload = require('express-fileupload');
const morgan = require('morgan');
const moment = require('moment-timezone');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const { getCurrentDateTimeLocal } = require('./utils/datetime');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Load env vars
if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: './config/config.test.env' });
} else {
  dotenv.config({ path: './config/config.env' });
}

// Connect to database
connectDB();

const app = express();

// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

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
    '\n:date[America/New_York] - Method=:method - URL=:url - Status=:status - ContentLength=:res[content-length] - ResponseTime=:response-time ms - UserAgent=:user-agent'
  );

  app.use(morgan('myformat'));
}

// File uploading
app.use(fileupload());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet({ contentSecurityPolicy: false }));

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 1000
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

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

module.exports = app;
