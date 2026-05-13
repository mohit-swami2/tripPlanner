const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { errorHandler } = require('./middlewares/errorHandler');
const AppError = require('./utils/AppError');
const { protect, restrictTo } = require('./middlewares/auth');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// Route imports
const websiteRoutes = require('./routes/website');
const adminRoutes = require('./routes/admin');

dotenv.config();

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
  max: 100, // limit each IP to 100 requests per windowMs
  windowMs: 60 * 60 * 1000, // 1 Hour
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);
app.use('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running OK' });
});

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Database Connection
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tripPlanner')
    .then(() => console.log('DB connection successful!'))
    .catch((err) => console.log('DB connection error:', err));
}

// Routes Definition
// 1. Website (Public APIs)
app.use('/api/v1/website', websiteRoutes);

// 2. Admin (Protected & Public Auth APIs)
app.use('/api/v1/admin', adminRoutes);

// Undefined Route Handler
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(errorHandler);

// Start server locally if run directly
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
  });
}

module.exports = app;
