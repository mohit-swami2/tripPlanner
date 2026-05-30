const { Router } = require('express');
const controller = require('./invoice.controller');

const router = Router();
router.get('/:tripId', controller.getByTrip);

module.exports = router;
