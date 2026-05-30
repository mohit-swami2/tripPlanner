const catchAsync = require('../../shared/utils/catchAsync');
const { sendSuccess } = require('../../shared/utils/response');
const vendorService = require('./vendor.service');

const list = catchAsync(async (req, res) => {
  const result = await vendorService.list(req.query);
  const { data, ...extras } = result;
  sendSuccess(res, 200, 'Vendors fetched', data, extras);
});

const create = catchAsync(async (req, res, next) => {
  try {
    const vendor = await vendorService.create(req.body);
    sendSuccess(res, 201, 'Vendor created', [{ vendorId: vendor.code, vendor }]);
  } catch (e) {
    next(e);
  }
});

const update = catchAsync(async (req, res, next) => {
  try {
    const vendor = await vendorService.update(req.params.id, req.body);
    sendSuccess(res, 200, 'Vendor updated', [vendor]);
  } catch (e) {
    next(e);
  }
});

const remove = catchAsync(async (req, res, next) => {
  try {
    await vendorService.softDelete(req.params.id);
    sendSuccess(res, 200, 'Vendor deleted', []);
  } catch (e) {
    next(e);
  }
});

const getOne = catchAsync(async (req, res, next) => {
  try {
    const vendor = await vendorService.getById(req.params.id);
    sendSuccess(res, 200, 'Vendor fetched', [vendor]);
  } catch (e) {
    next(e);
  }
});

module.exports = { list, create, update, remove, getOne };
