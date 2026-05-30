const { Router } = require('express');
const { validate } = require('../../../shared/middleware/validate');
const { publicSubmissionLimiter } = require('../../../shared/middleware/rateLimiter');
const controller = require('./testimonial.controller');
const schemas = require('./testimonial.schemas');

const router = Router();
router.use((req, _res, next) => {
  req.publicCms = true;
  next();
});
router.get('/', validate(schemas.listTestimonialSchema), controller.list);
router.post('/', publicSubmissionLimiter, validate(schemas.submitTestimonialSchema), controller.submit);

module.exports = router;
