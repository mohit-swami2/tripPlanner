const catchAsync = require('../../../shared/utils/catchAsync');
const { sendSuccess } = require('../../../shared/utils/response');
const service = require('./emailTemplate.service');

const list = catchAsync(async (req, res) => {
  const result = await service.list(req.query);
  const { data, ...extras } = result;
  sendSuccess(res, 200, 'Email templates fetched', data, extras);
});

const create = catchAsync(async (req, res, next) => {
  try {
    const tpl = await service.create(req.body);
    sendSuccess(res, 201, 'Template created', [tpl]);
  } catch (e) {
    next(e);
  }
});

const update = catchAsync(async (req, res, next) => {
  try {
    const tpl = await service.update(req.params.id, req.body);
    sendSuccess(res, 200, 'Template updated', [tpl]);
  } catch (e) {
    next(e);
  }
});

const remove = catchAsync(async (req, res, next) => {
  try {
    await service.softDelete(req.params.id);
    sendSuccess(res, 200, 'Template deleted', []);
  } catch (e) {
    next(e);
  }
});

module.exports = { list, create, update, remove };
