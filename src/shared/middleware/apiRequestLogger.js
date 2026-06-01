const { api, db, getMongooseStateLabel } = require('../utils/debugLogger');
const mongoose = require('mongoose');

const PUBLIC_PREFIXES = ['/health', '/public'];

const usesDatabase = (path) => !PUBLIC_PREFIXES.some((p) => path.startsWith(p));

const apiRequestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const route = req.originalUrl || req.url;

  api('incoming request', {
    method: req.method,
    route,
    timestamp,
    ip: req.ip,
  });

  if (usesDatabase(route)) {
    api('route start — may access MongoDB', {
      method: req.method,
      route,
      timestamp,
    });

    const readyState = mongoose.connection.readyState;
    if (readyState !== 1) {
      db('warning: request received but mongoose is not connected', {
        method: req.method,
        route,
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
      timestamp: new Date().toISOString(),
    });
  });

  next();
};

module.exports = apiRequestLogger;
