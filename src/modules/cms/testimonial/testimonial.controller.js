const catchAsync = require('../../../shared/utils/catchAsync');
const { sendSuccess } = require('../../../shared/utils/response');
const service = require('./testimonial.service');

const list = catchAsync(async (req, res) => {
  const publicOnly = req.publicCms === true;
  const result = await service.list(req.query, { publicOnly });
  const { data, ...extras } = result;
  sendSuccess(res, 200, 'Testimonials fetched', data, extras);
});

const submit = catchAsync(async (req, res, next) => {
  try {
    const item = await service.submit(req.body);
    sendSuccess(res, 201, 'Testimonial submitted for review', [item]);
  } catch (e) {
    next(e);
  }
});

const update = catchAsync(async (req, res, next) => {
  try {
    const item = await service.update(req.params.id, req.body);
    sendSuccess(res, 200, 'Testimonial updated', [item]);
  } catch (e) {
    next(e);
  }
});

const remove = catchAsync(async (req, res, next) => {
  try {
    await service.softDelete(req.params.id);
    sendSuccess(res, 200, 'Testimonial deleted', []);
  } catch (e) {
    next(e);
  }
});

module.exports = { list, submit, update, remove };
