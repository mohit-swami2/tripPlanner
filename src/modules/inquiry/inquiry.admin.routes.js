const { Router } = require('express');
const { validate } = require('../../shared/middleware/validate');
const { getRequestLimiter } = require('../../shared/middleware/rateLimiter');
const controller = require('./inquiry.controller');
const schemas = require('./inquiry.schemas');

const router = Router();
router.use(getRequestLimiter);
router.get('/', validate(schemas.listInquirySchema), controller.list);
router.get('/:id', validate(schemas.idParamSchema), controller.getOne);
router.patch('/:id/status', validate(schemas.updateInquiryStatusSchema), controller.updateStatus);
router.patch('/:id', validate(schemas.updateInquirySchema), controller.update);
router.delete('/:id', validate(schemas.idParamSchema), controller.remove);

module.exports = router;
