const { Router } = require('express');
const { validate } = require('../../shared/middleware/validate');
const { publicSubmissionLimiter } = require('../../shared/middleware/rateLimiter');
const controller = require('./inquiry.controller');
const schemas = require('./inquiry.schemas');

const router = Router();
router.post('/', publicSubmissionLimiter, validate(schemas.createInquirySchema), controller.create);

module.exports = router;
