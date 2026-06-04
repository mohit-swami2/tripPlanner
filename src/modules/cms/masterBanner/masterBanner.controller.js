const catchAsync = require('../../../shared/utils/catchAsync');
const { sendSuccess } = require('../../../shared/utils/response');
const { persistUpload, resolveFileUrlsDeep } = require('../../../shared/utils/fileUrl');
const service = require('./masterBanner.service');

const withResolvedImages = async (req, data) => resolveFileUrlsDeep(req, data);

const list = catchAsync(async (req, res) => {
  const publicOnly = req.publicCms === true;
  const result = await service.list(req.query, { publicOnly });
  const data = await withResolvedImages(req, result.data);
  const { data: _d, ...extras } = result;
  sendSuccess(res, 200, 'Master banners fetched', data, extras);
});

const save = catchAsync(async (req, res, next) => {
  if (!req.file && !req.body.image) {
    return next({ status: 400, message: 'Banner image is required (file or image key)' });
  }

  const image = req.file ? await persistUpload(req.file) : req.body.image;
  const banner = await service.save({
    title: req.body.title,
    linkUrl: req.body.linkUrl,
    sequence: req.body.sequence,
    isEnabled: req.body.isEnabled,
    image,
  });
  const data = await withResolvedImages(req, banner);
  sendSuccess(res, 201, 'Master banner saved', [data]);
});

const update = catchAsync(async (req, res, next) => {
  const payload = { ...req.body };
  if (req.file) payload.image = await persistUpload(req.file);
  if (!Object.keys(payload).length) {
    return next({ status: 400, message: 'No fields to update' });
  }

  const banner = await service.update(req.params.id, payload);
  const data = await withResolvedImages(req, banner);
  sendSuccess(res, 200, 'Master banner updated', [data]);
});

const reorder = catchAsync(async (req, res, next) => {
  try {
    const banners = await service.reorder(req.body.orderedIds);
    const data = await withResolvedImages(req, banners);
    sendSuccess(res, 200, 'Master banner sequence updated', data);
  } catch (e) {
    next(e);
  }
});

const setStatus = catchAsync(async (req, res, next) => {
  try {
    const banner = await service.setStatus(req.params.id, req.body.isEnabled);
    const data = await withResolvedImages(req, banner);
    sendSuccess(res, 200, 'Master banner status updated', [data]);
  } catch (e) {
    next(e);
  }
});

const remove = catchAsync(async (req, res, next) => {
  try {
    await service.softDelete(req.params.id);
    sendSuccess(res, 200, 'Master banner deleted', []);
  } catch (e) {
    next(e);
  }
});

module.exports = { list, save, update, reorder, setStatus, remove };
