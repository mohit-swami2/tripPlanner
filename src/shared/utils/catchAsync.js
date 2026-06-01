const { error, sanitizeBody } = require('./debugLogger');

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    error('async route handler error', err, {
      method: req.method,
      path: req.originalUrl || req.url,
      body: sanitizeBody(req.body),
      params: req.params,
      query: req.query,
    });
    next(err);
  });
};

module.exports = catchAsync;
