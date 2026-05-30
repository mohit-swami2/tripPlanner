const { Router } = require('express');
const { validate } = require('../../shared/middleware/validate');
const { publicSubmissionLimiter } = require('../../shared/middleware/rateLimiter');
const controller = require('./contactUs.controller');
const schemas = require('./contactUs.schemas');

const router = Router();
router.post('/', publicSubmissionLimiter, validate(schemas.submitContactSchema), controller.submit);
router.post('/contact', publicSubmissionLimiter, validate(schemas.submitContactSchema), controller.submit);

module.exports = router;
