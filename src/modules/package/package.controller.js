const catchAsync = require('../../shared/utils/catchAsync');
const { sendSuccess } = require('../../shared/utils/response');
const packageService = require('./package.service');

const list = catchAsync(async (req, res) => {
  const publicOnly = req.publicPackages === true;
  const result = await packageService.list(req.query, { publicOnly });
  const { data, ...extras } = result;
  sendSuccess(res, 200, 'Packages fetched', data, extras);
});

const create = catchAsync(async (req, res, next) => {
  try {
    const pkg = await packageService.create(req.body);
    sendSuccess(res, 201, 'Package created', [{ packageId: pkg.code, package: pkg }]);
  } catch (e) {
    next(e);
  }
});

const update = catchAsync(async (req, res, next) => {
  try {
    const pkg = await packageService.update(req.params.id, req.body);
    sendSuccess(res, 200, 'Package updated', [pkg]);
  } catch (e) {
    next(e);
  }
});

const remove = catchAsync(async (req, res, next) => {
  try {
    await packageService.softDelete(req.params.id);
    sendSuccess(res, 200, 'Package deleted', []);
  } catch (e) {
    next(e);
  }
});

const getOne = catchAsync(async (req, res, next) => {
  try {
    const pkg = await packageService.getById(req.params.id, { publicOnly: req.publicPackages === true });
    sendSuccess(res, 200, 'Package fetched', [pkg]);
  } catch (e) {
    next(e);
  }
});

module.exports = { list, create, update, remove, getOne };
