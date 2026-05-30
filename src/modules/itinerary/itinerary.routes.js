const { Router } = require('express');
const { validate } = require('../../shared/middleware/validate');
const controller = require('./itinerary.controller');
const schemas = require('./itinerary.schemas');

const router = Router();
router.post('/', validate(schemas.createItinerarySchema), controller.create);
router.get('/trip/:tripId', controller.getByTrip);

module.exports = router;
