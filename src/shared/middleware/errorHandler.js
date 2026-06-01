const { sendError } = require('../utils/response');
const { error, sanitizeBody } = require('../utils/debugLogger');

const errorHandler = (err, req, res, _next) => {
  error('global error handler', err, {
    method: req.method,
    path: req.originalUrl || req.url,
    body: sanitizeBody(req.body),
    statusCode: err?.status || err?.statusCode,
  });

  if (err?.status) {
    return sendError(res, err.status, err.message, err.details);
  }

  if (err.name === 'ValidationError') {
    return sendError(res, 400, err.message);
  }
  if (err.code === 11000) {
    return sendError(res, 400, 'Duplicate field value');
  }
  if (err.name === 'CastError') {
    return sendError(res, 400, `Invalid ${err.path}: ${err.value}`);
  }

  return sendError(res, 500, err.message || 'Internal server error');
};

module.exports = errorHandler;
