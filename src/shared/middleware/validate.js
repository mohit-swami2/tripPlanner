const { ZodError } = require('zod');

const cleanupFiles = (req) => {
  if (req.file?.path) {
    try {
      require('fs').unlinkSync(req.file.path);
    } catch (_) {}
  }
  if (req.files) {
    const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
    files.forEach((f) => {
      try {
        if (f.path) require('fs').unlinkSync(f.path);
      } catch (_) {}
    });
  }
};

const validate = (schema) => async (req, res, next) => {
  try {
    const parsed = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    if (parsed.body) req.body = parsed.body;
    if (parsed.query) req.query = parsed.query;
    if (parsed.params) req.params = parsed.params;
    return next();
  } catch (error) {
    cleanupFiles(req);
    if (error instanceof ZodError) {
      return next({
        status: 400,
        message: 'Validation failed',
        details: error.issues || error.errors,
      });
    }
    return next(error);
  }
};

module.exports = { validate };
