const catchAsync = require('../../shared/utils/catchAsync');
const { buildPackageBodyFromRequest } = require('./package.utils');

/** Normalizes multipart + JSON fields into req.body before Zod validation. */
const parsePackageBody = catchAsync(async (req, _res, next) => {
  req.body = await buildPackageBodyFromRequest(req);
  next();
});

module.exports = { parsePackageBody };
