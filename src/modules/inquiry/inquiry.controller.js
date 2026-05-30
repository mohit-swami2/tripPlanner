const catchAsync = require('../../shared/utils/catchAsync');
const { sendSuccess } = require('../../shared/utils/response');
const inquiryService = require('./inquiry.service');

const list = catchAsync(async (req, res) => {
  const result = await inquiryService.list(req.query);
  const { data, ...extras } = result;
  sendSuccess(res, 200, 'Inquiries fetched', data, extras);
});

const getOne = catchAsync(async (req, res, next) => {
  try {
    const inquiry = await inquiryService.getById(req.params.id);
    sendSuccess(res, 200, 'Inquiry fetched', [inquiry]);
  } catch (e) {
    next(e);
  }
});

const create = catchAsync(async (req, res, next) => {
  try {
    const inquiry = await inquiryService.create(req.body);
    sendSuccess(res, 201, 'Inquiry submitted', [{ inquiryId: inquiry.code, inquiry }]);
  } catch (e) {
    next(e);
  }
});

const update = catchAsync(async (req, res, next) => {
  try {
    const inquiry = await inquiryService.update(req.params.id, req.body);
    sendSuccess(res, 200, 'Inquiry updated', [inquiry]);
  } catch (e) {
    next(e);
  }
});

const updateStatus = catchAsync(async (req, res, next) => {
  try {
    const inquiry = await inquiryService.updateStatus(req.params.id, req.body.status);
    sendSuccess(res, 200, 'Inquiry status updated', [inquiry]);
  } catch (e) {
    next(e);
  }
});

const remove = catchAsync(async (req, res, next) => {
  try {
    await inquiryService.softDelete(req.params.id);
    sendSuccess(res, 200, 'Inquiry deleted', []);
  } catch (e) {
    next(e);
  }
});

module.exports = { list, getOne, create, update, updateStatus, remove };
