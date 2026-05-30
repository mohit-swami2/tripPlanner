const catchAsync = require('../../shared/utils/catchAsync');
const { sendSuccess } = require('../../shared/utils/response');
const tripService = require('./trip.service');

const list = catchAsync(async (req, res) => {
  const publicOnly = req.publicTrips === true;
  const result = await tripService.list(req.query, { publicOnly });
  const { data, ...extras } = result;
  sendSuccess(res, 200, 'Trips fetched', data, extras);
});

const create = catchAsync(async (req, res, next) => {
  try {
    const trip = await tripService.create(req.body);
    sendSuccess(res, 201, 'Trip created', [{ tripId: trip.code, trip }]);
  } catch (e) {
    next(e);
  }
});

const update = catchAsync(async (req, res, next) => {
  try {
    const trip = await tripService.update(req.params.id, req.body);
    sendSuccess(res, 200, 'Trip updated', [trip]);
  } catch (e) {
    next(e);
  }
});

const setEnabled = catchAsync(async (req, res, next) => {
  try {
    const trip = await tripService.setEnabled(req.params.id, req.body.isEnabled);
    sendSuccess(res, 200, req.body.isEnabled ? 'Trip enabled for website' : 'Trip disabled', [trip]);
  } catch (e) {
    next(e);
  }
});

const getOne = catchAsync(async (req, res, next) => {
  try {
    const trip = await tripService.getById(req.params.id, { publicOnly: req.publicTrips === true });
    sendSuccess(res, 200, 'Trip fetched', [trip]);
  } catch (e) {
    next(e);
  }
});

const remove = catchAsync(async (req, res, next) => {
  try {
    await tripService.softDelete(req.params.id);
    sendSuccess(res, 200, 'Trip deleted', []);
  } catch (e) {
    next(e);
  }
});

module.exports = { list, create, update, setEnabled, getOne, remove };
