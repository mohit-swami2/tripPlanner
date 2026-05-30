const rateLimit = require('express-rate-limit');

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 60 * 1000;
const max = Number(process.env.RATE_LIMIT_MAX) || 100;

const publicSubmissionLimiter = rateLimit({
  windowMs,
  max: Math.min(max, 30),
  message: { success: false, message: 'Too many submissions. Please try again later.', data: [] },
  standardHeaders: true,
  legacyHeaders: false,
});

const getRequestLimiter = rateLimit({
  windowMs,
  max,
  message: { success: false, message: 'Too many requests. Please try again later.', data: [] },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { publicSubmissionLimiter, getRequestLimiter };
