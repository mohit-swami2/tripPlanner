const { Router } = require('express');
const { validate } = require('../../shared/middleware/validate');
const controller = require('./payment.controller');
const schemas = require('./payment.schemas');

const router = Router();
router.get('/', validate(schemas.listPaymentSchema), controller.list);
router.get('/trip/:tripId', controller.listByTrip);
router.post('/', validate(schemas.createPaymentSchema), controller.create);

module.exports = router;
