const catchAsync = require('../../shared/utils/catchAsync');
const { sendSuccess } = require('../../shared/utils/response');
const paymentService = require('./payment.service');

const list = catchAsync(async (req, res) => {
  const result = await paymentService.list(req.query);
  const { data, ...extras } = result;
  sendSuccess(res, 200, 'Payments fetched', data, extras);
});

const create = catchAsync(async (req, res, next) => {
  try {
    const payment = await paymentService.create(req.body);
    sendSuccess(res, 201, 'Payment recorded', [{ paymentId: payment.code, payment }]);
  } catch (e) {
    next(e);
  }
});

const listByTrip = catchAsync(async (req, res) => {
  const payments = await paymentService.listByTrip(req.params.tripId);
  sendSuccess(res, 200, 'Trip payments fetched', payments);
});

module.exports = { list, create, listByTrip };
