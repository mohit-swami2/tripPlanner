const mongoose = require('mongoose');
const { connectDatabase } = require('../db/database');
const { db, error: logError, getMongooseStateLabel } = require('../utils/debugLogger');

/** Routes that do not require MongoDB before handling. */
const SKIP_PATH_PREFIXES = ['/health', '/public'];

const pathRequiresDatabase = (req) => {
  const path = req.originalUrl?.split('?')[0] || req.path || '';
  return !SKIP_PATH_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
};

/**
 * Ensures MongoDB is connected before route handlers run.
 * Required for Vercel serverless where start() / listen() may never run.
 */
const ensureDbConnection = async (req, res, next) => {
  if (!pathRequiresDatabase(req)) {
    return next();
  }

  const readyStateBefore = mongoose.connection.readyState;

  db('connection middleware executing', {
    method: req.method,
    path: req.originalUrl,
    readyStateBefore,
    stateBefore: getMongooseStateLabel(readyStateBefore),
  });

  try {
    const start = Date.now();
    await connectDatabase();
    db('connection middleware — ready to proceed', {
      method: req.method,
      path: req.originalUrl,
      readyState: mongoose.connection.readyState,
      state: getMongooseStateLabel(mongoose.connection.readyState),
      durationMs: Date.now() - start,
      reused: readyStateBefore === 1,
    });
    next();
  } catch (err) {
    logError('connection middleware — connectDatabase failed', err, {
      method: req.method,
      path: req.originalUrl,
      readyState: mongoose.connection.readyState,
    });
    next({
      status: 503,
      message: 'Database connection unavailable',
      details: process.env.NODE_ENV === 'production' ? undefined : err.message,
    });
  }
};

module.exports = ensureDbConnection;
