const mongoose = require('mongoose');
const { api, warning, getMongooseStateLabel, ts } = require('../utils/debugLogger');

const PUBLIC_PREFIXES = ['/health', '/public', '/api/debug/db', '/debug/db'];

const usesDatabase = (path) => !PUBLIC_PREFIXES.some((p) => path.startsWith(p));

const apiRequestLogger = (req, res, next) => {
  const timestamp = ts();
  const route = req.originalUrl || req.url;
  const readyState = mongoose.connection.readyState;

  api('incoming request', {
    method: req.method,
    route,
    timestamp,
    readyState,
    state: getMongooseStateLabel(readyState),
  });

  if (usesDatabase(route)) {
    api('route start — may access MongoDB', { method: req.method, route, timestamp });
    if (readyState !== 1) {
      warning('Database not connected before query execution', {
        route,
        method: req.method,
        readyState,
        state: getMongooseStateLabel(readyState),
      });
    }
  }

  const start = Date.now();
  res.on('finish', () => {
    api('request completed', {
      method: req.method,
      route,
      statusCode: res.statusCode,
      durationMs: Date.now() - start,
      readyState: mongoose.connection.readyState,
    });
  });

  next();
};

module.exports = apiRequestLogger;
