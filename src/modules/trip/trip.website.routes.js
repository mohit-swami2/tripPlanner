const { Router } = require('express');
const { validate } = require('../../shared/middleware/validate');
const controller = require('./trip.controller');
const schemas = require('./trip.schemas');

const router = Router();
router.use((req, _res, next) => {
  req.publicTrips = true;
  next();
});
router.get('/', validate(schemas.listTripSchema), controller.list);
router.get('/:id', validate(schemas.idParamSchema), controller.getOne);

module.exports = router;
