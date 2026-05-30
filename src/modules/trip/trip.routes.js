const { Router } = require('express');
const { validate } = require('../../shared/middleware/validate');
const controller = require('./trip.controller');
const schemas = require('./trip.schemas');

const router = Router();
router.get('/', validate(schemas.listTripSchema), controller.list);
router.get('/:id', validate(schemas.idParamSchema), controller.getOne);
router.post('/', validate(schemas.createTripSchema), controller.create);
router.patch('/:id/enable', validate(schemas.updateTripEnableSchema), controller.setEnabled);
router.patch('/:id', validate(schemas.updateTripSchema), controller.update);
router.delete('/:id', validate(schemas.idParamSchema), controller.remove);

module.exports = router;
