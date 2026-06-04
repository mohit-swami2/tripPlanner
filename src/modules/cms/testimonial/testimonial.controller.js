const catchAsync = require('../../../shared/utils/catchAsync');
const { sendSuccess } = require('../../../shared/utils/response');
const { persistUpload, resolveFileUrlsDeep } = require('../../../shared/utils/fileUrl');
const service = require('./testimonial.service');

const list = catchAsync(async (req, res) => {
  const publicOnly = req.publicCms === true;
  const result = await service.list(req.query, { publicOnly });
  const data = await resolveFileUrlsDeep(req, result.data);
  const { data: _d, ...extras } = result;
  sendSuccess(res, 200, 'Testimonials fetched', data, extras);
});

const submit = catchAsync(async (req, res, next) => {
  try {
    const item = await service.submit(req.body);
    const data = await resolveFileUrlsDeep(req, item);
    sendSuccess(res, 201, 'Testimonial submitted for review', [data]);
  } catch (e) {
    next(e);
  }
});

const create = catchAsync(async (req, res, next) => {
  if (!req.file && !req.body.image) {
    return next({ status: 400, message: 'Testimonial image is required (file or image key)' });
  }

  try {
    const image = req.file ? await persistUpload(req.file) : req.body.image;
    const item = await service.create({
      name: req.body.name,
      email: req.body.email,
      rating: req.body.rating,
      description: req.body.description,
      isEnabled: req.body.isEnabled,
      image,
    });
    const data = await resolveFileUrlsDeep(req, item);
    sendSuccess(res, 201, 'Testimonial created', [data]);
  } catch (e) {
    next(e);
  }
});

const update = catchAsync(async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (req.file) payload.image = await persistUpload(req.file);

    const item = await service.update(req.params.id, payload);
    const data = await resolveFileUrlsDeep(req, item);
    sendSuccess(res, 200, 'Testimonial updated', [data]);
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

module.exports = { list, submit, create, update, remove };
