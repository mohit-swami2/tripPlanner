const catchAsync = require('../../shared/utils/catchAsync');
const { sendSuccess } = require('../../shared/utils/response');
const { resolveFileUrlsDeep } = require('../../shared/utils/fileUrl');
const { normalizeMongoDoc } = require('../../shared/utils/serializeDoc');
const packageService = require('./package.service');

const withResolved = async (req, data) => resolveFileUrlsDeep(req, data);

const list = catchAsync(async (req, res) => {
  const publicOnly = req.publicPackages === true;
  const result = await packageService.list(req.query, { publicOnly });
  const data = await withResolved(req, result.data);
  const { data: _d, ...extras } = result;
  sendSuccess(res, 200, 'Packages fetched', data, extras);
});

const create = catchAsync(async (req, res, next) => {
  try {
    const pkg = await packageService.create(req.body);
    const data = await withResolved(req, normalizeMongoDoc(pkg));
    sendSuccess(res, 201, 'Package created', [{ packageId: data.code, ...data }]);
  } catch (e) {
    next(e);
  }
});

const update = catchAsync(async (req, res, next) => {
  try {
    const pkg = await packageService.update(req.params.id, req.body);
    const data = await withResolved(req, pkg);
    sendSuccess(res, 200, 'Package updated', [data]);
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
    const pkg = await packageService.getById(req.params.id, {
      publicOnly: req.publicPackages === true,
    });
    const data = await withResolved(req, pkg);
    sendSuccess(res, 200, 'Package fetched', [data]);
  } catch (e) {
    next(e);
  }
});

module.exports = { list, create, update, remove, getOne };
