const { Router } = require('express');
const { validate } = require('../../shared/middleware/validate');
const { getRequestLimiter } = require('../../shared/middleware/rateLimiter');
const controller = require('./vendor.controller');
const schemas = require('./vendor.schemas');

const router = Router();
router.use(getRequestLimiter);
router.get('/', validate(schemas.listVendorSchema), controller.list);
router.get('/:id', validate(schemas.updateVendorSchema.pick({ params: true })), controller.getOne);
router.post('/', validate(schemas.createVendorSchema), controller.create);
router.patch('/:id', validate(schemas.updateVendorSchema), controller.update);
router.delete('/:id', validate(schemas.updateVendorSchema.pick({ params: true })), controller.remove);

module.exports = router;
