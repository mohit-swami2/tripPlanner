const catchAsync = require('../../../shared/utils/catchAsync');
const { sendSuccess } = require('../../../shared/utils/response');
const service = require('./faq.service');

const list = catchAsync(async (req, res) => {
  const publicOnly = req.publicCms === true;
  const result = await service.list(req.query, { publicOnly });
  const { data, ...extras } = result;
  sendSuccess(res, 200, 'FAQs fetched', data, extras);
});

const create = catchAsync(async (req, res, next) => {
  try {
    const faq = await service.create(req.body);
    sendSuccess(res, 201, 'FAQ created', [faq]);
  } catch (e) {
    next(e);
  }
});

const update = catchAsync(async (req, res, next) => {
  try {
    const faq = await service.update(req.params.id, req.body);
    sendSuccess(res, 200, 'FAQ updated', [faq]);
  } catch (e) {
    next(e);
  }
});

const remove = catchAsync(async (req, res, next) => {
  try {
    await service.softDelete(req.params.id);
    sendSuccess(res, 200, 'FAQ deleted', []);
  } catch (e) {
    next(e);
  }
});

module.exports = { list, create, update, remove };
