const catchAsync = require('../../shared/utils/catchAsync');
const { sendSuccess } = require('../../shared/utils/response');
const itineraryService = require('./itinerary.service');

const create = catchAsync(async (req, res, next) => {
  try {
    const itinerary = await itineraryService.create(req.body);
    sendSuccess(res, 201, 'Itinerary saved', [itinerary]);
  } catch (e) {
    next(e);
  }
});

const getByTrip = catchAsync(async (req, res, next) => {
  try {
    const itinerary = await itineraryService.getByTrip(req.params.tripId);
    sendSuccess(res, 200, 'Itinerary fetched', [itinerary]);
  } catch (e) {
    next(e);
  }
});

module.exports = { create, getByTrip };
